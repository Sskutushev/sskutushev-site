from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass

TOKEN = re.compile(r"[\w+#.-]+", re.UNICODE)


@dataclass(frozen=True)
class Document:
    id: str
    text: str


def features(text: str) -> Counter[str]:
    normalized = " ".join(TOKEN.findall(text.casefold()))
    words = normalized.split()
    result: Counter[str] = Counter(f"w:{word}" for word in words)
    compact = f"  {normalized}  "
    result.update(f"c:{compact[index:index + 3]}" for index in range(max(len(compact) - 2, 0)))
    return result


def rank(query: str, documents: list[Document], limit: int) -> list[tuple[Document, float]]:
    if not query.strip() or not documents:
        return []
    vectors = [features(document.text) for document in documents]
    query_vector = features(query)
    document_frequency = Counter(
        feature for vector in vectors for feature in vector.keys()
    )
    count = len(documents)

    def weighted(vector: Counter[str]) -> dict[str, float]:
        return {
            feature: frequency * (math.log((count + 1) / (document_frequency[feature] + 1)) + 1)
            for feature, frequency in vector.items()
        }

    weighted_query = weighted(query_vector)
    query_norm = math.sqrt(sum(value * value for value in weighted_query.values()))
    scored: list[tuple[Document, float]] = []
    for document, vector in zip(documents, vectors, strict=True):
        weighted_document = weighted(vector)
        document_norm = math.sqrt(sum(value * value for value in weighted_document.values()))
        dot = sum(value * weighted_document.get(feature, 0) for feature, value in weighted_query.items())
        score = dot / (query_norm * document_norm) if query_norm and document_norm else 0
        scored.append((document, score))
    return sorted(scored, key=lambda item: (-item[1], item[0].id))[:limit]
