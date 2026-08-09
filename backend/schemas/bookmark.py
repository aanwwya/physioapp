from pydantic import BaseModel


class BookmarkCreate(BaseModel):
    mcq_id: int


class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    mcq_id: int
    subtopic_id: int

    class Config:
        from_attributes = True