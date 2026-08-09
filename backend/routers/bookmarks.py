from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.bookmark import Bookmark
from schemas.bookmark import BookmarkCreate, BookmarkResponse
from models.mcq import MCQ


router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"],
)


@router.post("/", response_model=BookmarkResponse)
def add_bookmark(
    bookmark: BookmarkCreate,
    db: Session = Depends(get_db),
):
    new_bookmark = Bookmark(
        user_id=1,
        mcq_id=bookmark.mcq_id,
    )

    db.add(new_bookmark)
    db.commit()
    db.refresh(new_bookmark)

    return new_bookmark


@router.get("/", response_model=list[BookmarkResponse])
def get_bookmarks(
    db: Session = Depends(get_db),
):
    bookmarks = (
        db.query(Bookmark, MCQ)
        .join(MCQ, Bookmark.mcq_id == MCQ.id)
        .filter(Bookmark.user_id == 1)
        .all()
    )

    return [
        {
            "id": bookmark.id,
            "user_id": bookmark.user_id,
            "mcq_id": bookmark.mcq_id,
            "subtopic_id": mcq.subtopic_id,
        }
        for bookmark, mcq in bookmarks
    ]

@router.delete("/{mcq_id}")
def delete_bookmark(
    mcq_id: int,
    db: Session = Depends(get_db),
):
    bookmark = db.query(Bookmark).filter(
        Bookmark.mcq_id == mcq_id,
        Bookmark.user_id == 1,
    ).first()

    if not bookmark:
        return {"message": "Bookmark not found"}

    db.delete(bookmark)
    db.commit()

    return {"message": "Bookmark removed successfully"}