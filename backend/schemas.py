from pydantic import BaseModel, Field
from typing import List

class StoryRequest(BaseModel):
    genre: str = Field(..., example="Cyberpunk Noir")
    protagonist: str = Field(..., example="A burned-out memory archivist")
    setting: str = Field(..., example="Neo-Shinjuku, perpetual acid rain")
    tone: str = Field(..., example="Gritty, atmospheric")
    premise: str = Field(..., example="Uncovers a memory chip.")

class StoryOutline(BaseModel):
    title: str = Field(description="A compelling, publishable title for the story")
    hook: str = Field(description="The opening scene hook establishing tension immediately")
    act_1_setup: str = Field(description="Introduction of status quo, inciting incident, and stakes")
    act_2_confrontation: str = Field(description="Escalating obstacles, midpoint twist, and darkest hour")
    act_3_resolution: str = Field(description="Climax and philosophical or narrative payoff")
    key_themes: List[str] = Field(description="2-3 central thematic elements")