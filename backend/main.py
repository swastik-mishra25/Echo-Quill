from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from core.config import settings
from routers import story, job
from db.database import create_tables

# LangChain + Gemini 2.5 Pro
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables from .env
load_dotenv()

# Ensure database tables are created
create_tables()

app = FastAPI(
    title="Choose Your Own Adventure Game API",
    description="API to generate cool stories using Gemini 2.5 Pro",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(story.router, prefix=settings.API_PREFIX)
app.include_router(job.router, prefix=settings.API_PREFIX)

# Initialize Gemini 2.5 Pro LLM using API key
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    api_key=settings.GEMINI_API_KEY
)

# Example endpoint to test Gemini
@app.get("/generate")
async def generate_response(input_text: str):
    prompt = PromptTemplate.from_template("Generate a story for: {input_text}")
    chain = LLMChain(prompt=prompt, llm=llm)
    response = await chain.apredict(input_text=input_text)
    return {"response": response}

@app.get("/")
def root():
    return {"message": "EchoQuill API running with Gemini 2.5 Pro 🚀"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
