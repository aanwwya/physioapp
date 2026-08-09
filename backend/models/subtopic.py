from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Subtopic(Base):
    __tablename__ = "subtopics"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    topic_id = Column(
        Integer,
        ForeignKey("topics.id"),
        nullable=False,
    )

    parent_id = Column(
        Integer,
        ForeignKey("subtopics.id"),
        nullable=True,
    )