from pydantic import BaseModel


class SubtopicCreate(BaseModel):
    name: str
    parent_id: int | None = None


class SubtopicResponse(BaseModel):
    id: int
    name: str
    topic_id: int
    parent_id: int | None = None

    class Config:
        from_attributes = True