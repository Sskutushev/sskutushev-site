import unittest

from app.ranking import Document, rank


class RankingTest(unittest.TestCase):
    def test_ranks_matching_engineering_evidence_first(self) -> None:
        documents = [
            Document("frontend", "React animation and accessible interfaces"),
            Document("backend", "NestJS cache reliability and CockroachDB transactions"),
        ]
        result = rank("reliable backend cache", documents, 2)
        self.assertEqual(result[0][0].id, "backend")
        self.assertGreater(result[0][1], result[1][1])

    def test_is_deterministic_for_equal_scores(self) -> None:
        documents = [Document("b", "unrelated"), Document("a", "unrelated")]
        self.assertEqual([item[0].id for item in rank("missing", documents, 2)], ["a", "b"])

    def test_rejects_empty_work_without_fabricating_scores(self) -> None:
        self.assertEqual(rank("", [Document("a", "text")], 1), [])


if __name__ == "__main__":
    unittest.main()
