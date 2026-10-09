import json
import traceback
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from schemas import StoryIdeaRequest, EditedOutlineRequest
from chains import outline_chain, story_streaming_chain

app = FastAPI(title="EchoQuill Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# STAGE 1: Generate Outline (Standard JSON Response)
# ---------------------------------------------------------
@app.post("/api/story/outline")
async def generate_outline(request: StoryIdeaRequest):
    try:
        payload = request.model_dump()
        print(f"DEBUG: Generating outline for: {payload}")
        
        # Bypass the async deadlock bug
        outline = await asyncio.to_thread(outline_chain.invoke, payload)
        
        # Return as a clean JSON dictionary
        return outline.model_dump() if hasattr(outline, 'model_dump') else dict(outline)
        
    except Exception as e:
        print(f"CRITICAL ERROR IN OUTLINE: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# STAGE 2: Stream Story (SSE Response)
# ---------------------------------------------------------
async def story_event_generator(request_data: EditedOutlineRequest):
    try:
        story_inputs = request_data.model_dump()
        print(f"DEBUG: Streaming story for outline: {story_inputs['title']}")
        
        async for chunk in story_streaming_chain.astream(story_inputs):
            yield {
                "event": "chunk",
                "data": json.dumps({"text": chunk})
            }
        
        yield {
            "event": "done",
            "data": json.dumps({"status": "completed"})
        }
        
    except Exception as e:
        print(f"CRITICAL ERROR IN STREAM: {str(e)}")
        traceback.print_exc()
        yield {
            "event": "error",
            "data": json.dumps({"error": str(e)})
        }

@app.post("/api/story/stream")
async def stream_story(request: EditedOutlineRequest):
    return EventSourceResponse(story_event_generator(request), ping=15)