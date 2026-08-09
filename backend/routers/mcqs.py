from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.mcq import MCQ
from schemas.mcq import MCQCreate, MCQResponse, MCQBulkCreate


router = APIRouter(
    prefix="/subtopics",
    tags=["MCQs"]
)


@router.post("/{subtopic_id}/mcqs/", response_model=MCQResponse)
def add_mcq(
    subtopic_id: int,
    mcq: MCQCreate,
    db: Session = Depends(get_db)
):

    new_mcq = MCQ(
        subtopic_id=subtopic_id,
        question=mcq.question,
        option_a=mcq.option_a,
        option_b=mcq.option_b,
        option_c=mcq.option_c,
        option_d=mcq.option_d,
        correct_answer=mcq.correct_answer,
        explanation=mcq.explanation
    )

    db.add(new_mcq)
    db.commit()
    db.refresh(new_mcq)

    return new_mcq


@router.post("/bulk-mcqs/", response_model=list[MCQResponse])
def add_bulk_mcqs(
    mcqs: MCQBulkCreate,
    db: Session = Depends(get_db)
):
    new_mcqs = []

    for mcq in mcqs.questions:
        new_mcq = MCQ(
            subtopic_id=mcq.subtopic_id,
            question=mcq.question,
            option_a=mcq.option_a,
            option_b=mcq.option_b,
            option_c=mcq.option_c,
            option_d=mcq.option_d,
            correct_answer=mcq.correct_answer,
            explanation=mcq.explanation
        )

        db.add(new_mcq)
        new_mcqs.append(new_mcq)

    db.commit()

    for mcq in new_mcqs:
        db.refresh(mcq)

    return new_mcqs





@router.get("/{subtopic_id}/mcqs/", response_model=list[MCQResponse])
def get_mcqs(
    subtopic_id: int,
    db: Session = Depends(get_db)
):

    mcqs = db.query(MCQ).filter(
        MCQ.subtopic_id == subtopic_id
    ).all()

    return mcqs



@router.delete("/{subtopic_id}/mcqs/{mcq_id}")
def delete_mcq(
    subtopic_id: int,
    mcq_id: int,
    db: Session = Depends(get_db)
):
    mcq = db.query(MCQ).filter(
        MCQ.id == mcq_id,
        MCQ.subtopic_id == subtopic_id
    ).first()

    if not mcq:
        return {"message": "MCQ not found"}

    db.delete(mcq)
    db.commit()

    return {"message": "MCQ deleted successfully"}


@router.delete("/{subtopic_id}/mcqs/")
def delete_all_mcqs(
    subtopic_id: int,
    db: Session = Depends(get_db)
):
    mcqs = db.query(MCQ).filter(
        MCQ.subtopic_id == subtopic_id
    ).all()

    count = len(mcqs)

    for mcq in mcqs:
        db.delete(mcq)

    db.commit()

    return {
        "message": "All MCQs deleted successfully",
        "deleted_count": count
    }