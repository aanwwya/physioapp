from sqlalchemy.orm import Session

from models.user import User
from schemas.user import UserCreate
from security import hash_password


def create_user(db: Session, user: UserCreate):
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user