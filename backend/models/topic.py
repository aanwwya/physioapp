from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    order = Column(Integer, nullable=False, default=0)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id"),
        nullable=False,
    )