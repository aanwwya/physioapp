from pydantic import BaseModel


class BookCreate(BaseModel):
    name: str


class BookResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True