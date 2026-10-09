from pydantic import BaseModel, Field

# ---------------------------------------------------------
# LANGCHAIN INTERNAL SCHEMA (Used by chains.py)
# ---------------------------------------------------------
class StoryOutline(BaseModel):
    title: str = Field(description="The title of the story")
    hook: str = Field(description="A compelling hook or opening line")
    act_1_setup: str = Field(description="Setup and inciting incident")
    act_2_confrontation: str = Field(description="Rising action and confrontation")
    act_3_resolution: str = Field(description="Climax and resolution")

# ---------------------------------------------------------
# FASTAPI ENDPOINT SCHEMAS (Used by main.py)
# ---------------------------------------------------------
# Stage 1: The initial form data from the React frontend
class StoryIdeaRequest(BaseModel):
    genre: str
    protagonist: str
    setting: str
    tone: str
    premise: str

# Stage 2: The edited outline + tone sent back to start the stream
class EditedOutlineRequest(BaseModel):
    title: str
    hook: str
    act_1_setup: str
    act_2_confrontation: str
    act_3_resolution: str
    tone: str