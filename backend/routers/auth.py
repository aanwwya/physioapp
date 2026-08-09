from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from schemas.user import UserCreate
from fastapi.security import OAuth2PasswordRequestForm

from services.user_service import create_user
from services.auth_service import login_user
from security import get_current_user


router = APIRouter()


@router.get("/test")
def test():
    return {"message": "Auth router is working"}


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user)

    return {
        "message": "Account created successfully",
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
    }


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    result = login_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return result
    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return result



@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated",
        "user": current_user
    }