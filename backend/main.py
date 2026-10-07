import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from schemas import StoryRequest
from chains import outline_chain, story_streaming_chain

app = FastAPI(title="EchoQuill Engine")

# CORS setup for React Vite frontend (defaults to localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def story_event_generator(request_data: StoryRequest):
    payload = request_data.model_dump()
    
    # 1. Generate Structured Outline (Stage 1)
    outline = await outline_chain.ainvoke(payload)
    
    # Push outline JSON immediately to UI
    yield {
        "event": "outline",
        "data": outline.model_dump_json()
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
    async for chunk in story_streaming_chain.astream(story_inputs):
        yield {
            "event": "chunk",
            "data": json.dumps({"text": chunk})
        }
    
    # Signal completion
    yield {
        "event": "done",
        "data": json.dumps({"status": "completed"})
    }

@app.post("/api/story/stream")
async def stream_story(request: StoryRequest):
    return EventSourceResponse(story_event_generator(request))