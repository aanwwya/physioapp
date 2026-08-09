from sqlalchemy.orm import Session

from models.subject import Subject
from schemas.subject import SubjectCreate


def create_subject(db: Session, subject: SubjectCreate):

    new_subject = Subject(
        name=subject.name
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject


def get_subjects(db: Session):

    return db.query(Subject).all()