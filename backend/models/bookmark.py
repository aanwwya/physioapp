from sqlalchemy import Column, Integer, ForeignKey
from database import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    mcq_id = Column(
        Integer,
        ForeignKey("mcqs.id"),
        nullable=False,
    )