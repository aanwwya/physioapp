from pydantic import BaseModel


class MCQCreate(BaseModel):
    subtopic_id: int

    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str

    explanation: str | None = None


class MCQResponse(BaseModel):
    id: int
    subtopic_id: int

    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str

    explanation: str | None = None

    class Config:
        from_attributes = True
        
        
class MCQBulkCreate(BaseModel):
    questions: list[MCQCreate]