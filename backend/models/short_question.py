from sqlalchemy import Column, Integer, Text, ForeignKey
from database import Base


class ShortQuestion(Base):
    __tablename__ = "short_questions"

    id = Column(Integer, primary_key=True, index=True)

    subtopic_id = Column(
        Integer,
        ForeignKey("subtopics.id"),
        nullable=False,
    )

    question = Column(Text, nullable=False)

    answer = Column(Text, nullable=False)