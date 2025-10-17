import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session

from db.database import get_db, SessionLocal
from models.story import Story, StoryNode
from models.job import StoryJob
from schemas.story import CompleteStoryResponse, CompleteStoryNodeResponse, CreateStoryRequest
from schemas.job import StoryJobResponse
from core.story_generator import StoryGenerator

router = APIRouter(prefix="/stories", tags=["stories"])


# Generate a unique session_id cookie for each user
def get_session_id(session_id: Optional[str] = Cookie(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id


@router.post("/create", response_model=StoryJobResponse)
def create_story(
    request: CreateStoryRequest,
    background_tasks: BackgroundTasks,
    response: Response,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    """Queue a new story generation task."""
    response.set_cookie(key="session_id", value=session_id, httponly=True)
    job_id = str(uuid.uuid4())

    job = StoryJob(
        job_id=job_id,
        session_id=session_id,
        theme=request.theme,
        status="pending"
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(generate_story_task, job_id, request.theme, session_id)
    return job


def generate_story_task(job_id: str, theme: str, session_id: str):
    """Runs in background to generate the story."""
    db = SessionLocal()
    try:
        job = db.query(StoryJob).filter(StoryJob.job_id == job_id).first()
        if not job:
            print(f"⚠️ Job not found for ID: {job_id}")
            return

        job.status = "processing"
        db.commit()

        try:
            story = StoryGenerator.generate_story(db, session_id, theme)
            job.story_id = story.id
            job.status = "completed"
            job.completed_at = datetime.now()
            db.commit()
            print(f"✅ Story {story.id} generated successfully for theme '{theme}'")

        except Exception as e:
            job.status = "failed"
            job.completed_at = datetime.now()
            job.error = str(e)
            db.commit()
            print(f"❌ Story generation failed: {e}")

    finally:
        db.close()


@router.get("/{story_id}/complete", response_model=CompleteStoryResponse)
def get_complete_story(story_id: int, db: Session = Depends(get_db)):
    """Fetch the complete generated story with all its nodes."""
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    return build_complete_story_tree(db, story)


def build_complete_story_tree(db: Session, story: Story) -> CompleteStoryResponse:
    """Build a tree structure for the full story."""
    nodes = db.query(StoryNode).filter(StoryNode.story_id == story.id).all()
    if not nodes:
        raise HTTPException(status_code=500, detail="No nodes found for this story")

    node_dict = {}
    for n in nodes:
        node_dict[n.id] = CompleteStoryNodeResponse(
            id=n.id,
            content=n.content,
            is_ending=n.is_ending,
            is_winning_ending=n.is_winning_ending,
            options=n.options or []
        )

    root_node = next((n for n in nodes if n.is_root), None)
    if not root_node:
        raise HTTPException(status_code=500, detail="Story root node not found")

    return CompleteStoryResponse(
        id=story.id,
        title=story.title,
        session_id=story.session_id,
        created_at=story.created_at,
        root_node=node_dict[root_node.id],
        all_nodes=node_dict
    )
