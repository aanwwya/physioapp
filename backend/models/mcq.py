from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class MCQ(Base):
    __tablename__ = "mcqs"

    id = Column(Integer, primary_key=True, index=True)

    subtopic_id = Column(
        Integer,
        ForeignKey("subtopics.id")
    )

    question = Column(String)

    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)

    correct_answer = Column(String)

    explanation = Column(String)