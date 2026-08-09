from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.short_question import ShortQuestion
from schemas.short_question import (
    ShortQuestionCreate,
    ShortQuestionResponse,
    ShortQuestionBulkCreate,
)

router = APIRouter(
    prefix="/subtopics",
    tags=["Short Questions"]
)


@router.post(
    "/{subtopic_id}/short-questions/",
    response_model=ShortQuestionResponse
)
def add_short_question(
    subtopic_id: int,
    short_question: ShortQuestionCreate,
    db: Session = Depends(get_db)
):
    new_question = ShortQuestion(
        subtopic_id=subtopic_id,
        question=short_question.question,
        answer=short_question.answer
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question


@router.post(
    "/bulk-short-questions/",
    response_model=list[ShortQuestionResponse]
)
def add_bulk_short_questions(
    short_questions: ShortQuestionBulkCreate,
    db: Session = Depends(get_db)
):
    new_questions = []

    for item in short_questions.questions:
        new_question = ShortQuestion(
            subtopic_id=item.subtopic_id,
            question=item.question,
            answer=item.answer
        )

        db.add(new_question)
        new_questions.append(new_question)

    db.commit()

    for question in new_questions:
        db.refresh(question)

    return new_questions


@router.get(
    "/{subtopic_id}/short-questions/",
    response_model=list[ShortQuestionResponse]
)
def get_short_questions(
    subtopic_id: int,
    db: Session = Depends(get_db)
):
    questions = db.query(ShortQuestion).filter(
        ShortQuestion.subtopic_id == subtopic_id
    ).all()

    return questions




@router.delete(
    "/{subtopic_id}/short-questions/{question_id}"
)
def delete_short_question(
    subtopic_id: int,
    question_id: int,
    db: Session = Depends(get_db)
):
    question = db.query(ShortQuestion).filter(
        ShortQuestion.id == question_id,
        ShortQuestion.subtopic_id == subtopic_id
    ).first()

    if not question:
        return {"message": "Short question not found"}

    db.delete(question)
    db.commit()

    return {"message": "Short question deleted successfully"}