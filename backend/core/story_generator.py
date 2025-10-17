from sqlalchemy.orm import Session
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from google import genai
from datetime import datetime
import json

from core.prompts import STORY_PROMPT
from models.story import Story, StoryNode
from core.models import StoryLLMResponse, StoryNodeLLM
from core.config import settings

# Initialize Gemini client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


class StoryGenerator:

    @classmethod
    def generate_story(cls, db: Session, session_id: str, theme: str = "fantasy") -> Story:
        """Generates and stores a story using Gemini 2.5 Pro, with fallbacks."""
        try:
            # Prepare structured prompt and parser
            story_parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)
            prompt = ChatPromptTemplate.from_messages([
                ("system", STORY_PROMPT),
                ("human", f"Create a story with the theme '{theme}'. Follow the structure strictly.")
            ]).partial(format_instructions=story_parser.get_format_instructions())

            prompt_text = prompt.format()
            print(f"🧠 Prompt sent to Gemini: {prompt_text[:150]}...")

            # Call Gemini 2.5 Pro
            response = client.models.generate_content(
                model="gemini-2.5-pro",
                contents=prompt_text,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 1024,
                    "top_p": 0.9,
                    "top_k": 40
                }
            )

            # Extract text safely
            if hasattr(response, "candidates") and len(response.candidates) > 0:
                text_response = response.candidates[0].content.parts[0].text.strip()
            else:
                text_response = str(response)

            print(f"✅ Gemini raw response: {text_response[:150]}...")

            # Parse structured JSON safely
            try:
                # Ensure parsing works even if model returns extra formatting
                story_data = story_parser.parse(text_response)
            except Exception as e:
                print(f"⚠️ Parsing failed: {e}")
                return cls._create_fallback_story(db, session_id, f"Parsing failed: {str(e)}")

            # Store story in DB
            story_db = Story(title=story_data.title or "Untitled Story", session_id=session_id)
            db.add(story_db)
            db.flush()

            root_node_data = story_data.rootNode
            if isinstance(root_node_data, dict):
                root_node_data = StoryNodeLLM.model_validate(root_node_data)

            cls._process_story_node(db, story_db.id, root_node_data, is_root=True)
            db.commit()
            return story_db

        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            return cls._create_fallback_story(db, session_id, f"Gemini API error: {str(e)}")

    @classmethod
    def _process_story_node(cls, db: Session, story_id: int, node_data: StoryNodeLLM, is_root: bool = False) -> StoryNode:
        """Recursively process story nodes."""
        node = StoryNode(
            story_id=story_id,
            content=getattr(node_data, "content", ""),
            is_root=is_root,
            is_ending=getattr(node_data, "isEnding", True),
            is_winning_ending=getattr(node_data, "isWinningEnding", False),
            options=[]
        )
        db.add(node)
        db.flush()

        if not node.is_ending and getattr(node_data, "options", None):
            options_list = []
            for option_data in node_data.options:
                next_node = option_data.nextNode
                if isinstance(next_node, dict):
                    next_node = StoryNodeLLM.model_validate(next_node)

                child_node = cls._process_story_node(db, story_id, next_node, False)
                options_list.append({"text": option_data.text, "node_id": child_node.id})

            node.options = options_list
            db.flush()

        return node

    @classmethod
    def _create_fallback_story(cls, db: Session, session_id: str, error_message: str) -> Story:
        """Create a fallback story if Gemini fails."""
        story = Story(
            title="Story generation failed",
            session_id=session_id,
            created_at=datetime.now()
        )
        db.add(story)
        db.flush()

        root_node = StoryNode(
            story_id=story.id,
            content=f"Story generation failed due to: {error_message}",
            is_root=True,
            is_ending=True,
            is_winning_ending=False,
            options=[]
        )
        db.add(root_node)
        db.commit()

        print(f"⚠️ Fallback story created for session {session_id}: {error_message}")
        return story
