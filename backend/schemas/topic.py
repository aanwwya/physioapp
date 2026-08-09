from pydantic import BaseModel


class TopicCreate(BaseModel):
    name: str


class TopicResponse(BaseModel):
    id: int
    name: str
    subject_id: int

    class Config:
        from_attributes = True