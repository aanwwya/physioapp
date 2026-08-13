from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.topic import Topic
from schemas.topic import TopicCreate

router = APIRouter(
    prefix="/subjects/{subject_id}/topics",
    tags=["Topics"],
)


@router.get("/")
def get_topics(subject_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Topic)
        .filter(Topic.subject_id == subject_id)
        .order_by(Topic.order)
        .all()
    )


@router.post("/")
def add_topic(
    subject_id: int,
    topic: TopicCreate,
    db: Session = Depends(get_db),
):
    new_topic = Topic(
        name=topic.name,
        subject_id=subject_id,
    )

    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    return new_topic