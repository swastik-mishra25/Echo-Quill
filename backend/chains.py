import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from schemas import StoryOutline

# Load environment variables (.env file)
load_dotenv()

# Explicitly grab the key using your existing variable name
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

# Base LLM initialized with your explicit key
llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    temperature=0.7,
    api_key=api_key
)

# --- Stage 1: Structured Outline Generator ---
outline_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an award-winning creative writing architect. "
        "Analyze the user's premise and construct a coherent, tightly structured story outline. "
        "Focus on narrative causality: every action must cause a reaction.",
    ),
    (
        "human",
        "Genre: {genre}\n"
        "Protagonist: {protagonist}\n"
        "Setting: {setting}\n"
        "Tone: {tone}\n"
        "Core Premise: {premise}\n",
    ),
])

# Enforce structured output via Pydantic
outline_chain = outline_prompt | llm.with_structured_output(StoryOutline)

# --- Stage 2: Story Prose Writer (Streaming) ---
story_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a master fiction author. Write a gripping, rich narrative that strictly executes "
        "the provided outline. Use sensory details, active verbs, and sharp dialogue.\n"
        "Format using clean Markdown (scene breaks with '---', proper paragraph breaks).",
    ),
    (
        "human",
        "OUTLINE BLUEPRINT:\n"
        "Title: {title}\n"
        "Hook: {hook}\n"
        "Act 1: {act_1_setup}\n"
        "Act 2: {act_2_confrontation}\n"
        "Act 3: {act_3_resolution}\n"
        "Tone: {tone}\n\n"
        "Write the complete story now, adhering strictly to the acts above.",
    ),
])

story_streaming_chain = story_prompt | llm | StrOutputParser()