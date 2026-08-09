from fastapi import FastAPI
from database import engine, Base
from models.user import User
from models.book_volume import BookVolume
from routers.auth import router as auth_router
from routers import subjects
from models.book import Book
from routers import books
from models.topic import Topic
from routers import topics
from models.subtopic import Subtopic
from routers import subtopics
from routers import mcqs
from routers.bookmarks import router as bookmarks_router
from models.bookmark import Bookmark
from routers import short_questions


Base.metadata.create_all(bind=engine)

app = FastAPI(title="PhysioFlow API")

app.include_router(auth_router)
app.include_router(subjects.router)
app.include_router(books.router)
app.include_router(topics.router)
app.include_router(subtopics.router)
app.include_router(mcqs.router)
app.include_router(bookmarks_router)
app.include_router(short_questions.router)

@app.get("/")
def home():
    return {
        "message": "Welcome to PhysioFlow API"
    }