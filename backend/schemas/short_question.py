from pydantic import BaseModel


class ShortQuestionCreate(BaseModel):
    question: str
    answer: str


class ShortQuestionBulkItem(BaseModel):
    subtopic_id: int
    question: str
    answer: str


class ShortQuestionBulkCreate(BaseModel):
    questions: list[ShortQuestionBulkItem]


class ShortQuestionResponse(BaseModel):
    id: int
    subtopic_id: int
    question: str
    answer: str

    class Config:
        from_attributes = True