from pydantic import BaseModel


class BookVolumeCreate(BaseModel):
    name: str


class BookVolumeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True