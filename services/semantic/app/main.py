from fastapi import FastAPI
from pydantic import BaseModel, Field

from .ranking import Document, rank

app = FastAPI(title="Portfolio similarity service", version="1.0.0")


class DocumentInput(BaseModel):
    id: str = Field(min_length=1, max_length=120)
    text: str = Field(min_length=1, max_length=8000)


class RankRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)
    documents: list[DocumentInput] = Field(min_length=1, max_length=200)
    limit: int = Field(default=5, ge=1, le=20)


class RankedDocument(BaseModel):
    id: str
    score: float


@app.get("/health/live")
def live() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/rank", response_model=list[RankedDocument])
def rank_documents(request: RankRequest) -> list[RankedDocument]:
    documents = [Document(id=item.id, text=item.text) for item in request.documents]
    return [
        RankedDocument(id=document.id, score=round(score, 6))
        for document, score in rank(request.query, documents, request.limit)
    ]
