import json
import traceback
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from schemas import StoryRequest
from chains import outline_chain, story_streaming_chain

app = FastAPI(title="EchoQuill Engine")

# CORS setup for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def story_event_generator(request_data: StoryRequest):
    try:
        payload = request_data.model_dump()
        print(f"DEBUG: Starting generation with payload: {payload}")
        
        # 1. Generate Structured Outline (Stage 1)
        print("DEBUG: Contacting Gemini for outline...")
        outline = await asyncio.to_thread(outline_chain.invoke, payload)
        print("DEBUG: Outline generated successfully!")
        
        # Push outline JSON immediately to UI
        yield {
            "event": "outline",
            "data": outline.model_dump_json() if hasattr(outline, 'model_dump_json') else json.dumps(dict(outline))
        }
        
        # Prepare prompt parameters for Stage 2
        story_inputs = {
            "title": outline.title,
            "hook": outline.hook,
            "act_1_setup": outline.act_1_setup,
            "act_2_confrontation": outline.act_2_confrontation,
            "act_3_resolution": outline.act_3_resolution,
            "tone": payload["tone"],
        }
        
        # 2. Stream Story Tokens (Stage 2)
        print("DEBUG: Streaming story chunks...")
        async for chunk in story_streaming_chain.astream(story_inputs):
            yield {
                "event": "chunk",
                "data": json.dumps({"text": chunk})
            }
        
        # Signal completion
        print("DEBUG: Stream completed successfully.")
        yield {
            "event": "done",
            "data": json.dumps({"status": "completed"})
        }
        
    except Exception as e:
        # Catch the silent crash and print the full stack trace to Render logs
        print(f"CRITICAL ERROR IN STREAM: {str(e)}")
        traceback.print_exc()
        
        # Send the error to the React frontend so it stops spinning
        yield {
            "event": "error",
            "data": json.dumps({"error": str(e)})
        }

@app.post("/api/story/stream")
async def stream_story(request: StoryRequest):
    # ping=15 keeps the connection alive while Gemini thinks
    return EventSourceResponse(story_event_generator(request), ping=15)