from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class BookVolume(Base):
    __tablename__ = "book_volumes"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id")
    )

    subject = relationship("Subject")