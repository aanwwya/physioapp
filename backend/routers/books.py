from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.book import Book
from schemas.book import BookCreate

router = APIRouter(
    prefix="/subjects/{subject_id}/books",
    tags=["Books"],
)


@router.get("/")
def get_books(subject_id: int, db: Session = Depends(get_db)):
    books = (
        db.query(Book)
        .filter(Book.subject_id == subject_id)
        .all()
    )

    return books


@router.post("/")
def add_book(
    subject_id: int,
    book: BookCreate,
    db: Session = Depends(get_db),
):
    new_book = Book(
        name=book.name,
        subject_id=subject_id,
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book