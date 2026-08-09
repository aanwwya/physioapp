from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.subtopic import Subtopic
from schemas.subtopic import SubtopicCreate, SubtopicResponse

router = APIRouter(
    prefix="/topics/{topic_id}/subtopics",
    tags=["Subtopics"],
)


@router.get("/", response_model=list[SubtopicResponse])
def get_subtopics(
    topic_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Subtopic)
        .filter(Subtopic.topic_id == topic_id)
        .all()
    )


@router.post("/", response_model=SubtopicResponse)
def add_subtopic(
    topic_id: int,
    subtopic: SubtopicCreate,
    db: Session = Depends(get_db)
):
    new_subtopic = Subtopic(
        name=subtopic.name,
        topic_id=topic_id,
        parent_id=subtopic.parent_id,
    )

    db.add(new_subtopic)
    db.commit()
    db.refresh(new_subtopic)

    return new_subtopic




@router.get("/parent/{parent_id}", response_model=list[SubtopicResponse])
def get_child_subtopics(
    topic_id: int,
    parent_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Subtopic)
        .filter(
            Subtopic.topic_id == topic_id,
            Subtopic.parent_id == parent_id
        )
        .all()
    )











@router.get("/all", response_model=list[SubtopicResponse])
def get_all_subtopics(
    db: Session = Depends(get_db)
):
    return db.query(Subtopic).all()


@router.delete("/{subtopic_id}")
def delete_subtopic(
    topic_id: int,
    subtopic_id: int,
    db: Session = Depends(get_db)
):
    subtopic = (
        db.query(Subtopic)
        .filter(
            Subtopic.id == subtopic_id,
            Subtopic.topic_id == topic_id
        )
        .first()
    )

    if not subtopic:
        return {
            "message": "Subtopic not found"
        }

    db.delete(subtopic)
    db.commit()

    return {
        "message": "Subtopic deleted successfully",
        "deleted_id": subtopic_id
    }