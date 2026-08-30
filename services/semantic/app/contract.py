from pydantic import BaseModel

from .ranking import Document, rank


class Match(BaseModel):
    caseStudyId: str
    score: float


class RankResponse(BaseModel):
    matches: list[Match]
    modelVersion: str


def build_rank_response(
    query: str, documents: list[Document], limit: int
) -> RankResponse:
    return RankResponse(
        matches=[
            Match(caseStudyId=document.id, score=round(score, 6))
            for document, score in rank(query, documents, limit)
        ],
        modelVersion="lexical-v1",
    )
