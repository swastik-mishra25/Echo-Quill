from pydantic import BaseModel

# Stage 1: The initial form data
class StoryIdeaRequest(BaseModel):
    genre: str
    protagonist: str
    setting: str
    tone: str
    premise: str

# Stage 2: The edited outline + tone for the stream
class EditedOutlineRequest(BaseModel):
    title: str
    hook: str
    act_1_setup: str
    act_2_confrontation: str
    act_3_resolution: str
    tone: str