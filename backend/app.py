from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# LangChain + Gemini 2.5 Flash
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

app = FastAPI(title="EchoQuill API - Gemini 2.5 Flash 🚀")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    api_key=api_key
)

class GenerateRequest(BaseModel):
    theme: str
    genre: str = ""
    tone: str = ""
    length: str = ""

@app.get("/")
async def root():
    return {"message": "EchoQuill API running with Gemini 2.5 Flash 🚀"}

@app.post("/generate")
async def generate_story(request: GenerateRequest):
    if not request.theme.strip():
        raise HTTPException(status_code=400, detail="Missing 'theme' field")
    
    prompt = PromptTemplate.from_template(
        "Generate a {length} {genre} story with a {tone} tone based on the theme: {theme}"
    )

    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser

    async def story_streamer():
        try:
            async for chunk in chain.astream({
                "theme": request.theme.strip(),
                "genre": request.genre.strip(),
                "tone": request.tone.strip(),
                "length": request.length.strip()
            }):
                yield chunk
        except Exception as e:
            yield f"\n\n[Error generating story: {str(e)}]"

    return StreamingResponse(story_streamer(), media_type="text/plain")