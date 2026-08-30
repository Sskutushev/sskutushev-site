import unittest

from app.contract import build_rank_response
from app.ranking import Document


class ApiContractTest(unittest.TestCase):
    def test_returns_versioned_case_match_contract(self) -> None:
        response = build_rank_response(
            "cache reliability",
            [
                Document(id="frontend", text="React interface"),
                Document(id="cache-case", text="Redis cache reliability"),
            ],
            1,
        )

        self.assertEqual(response.modelVersion, "lexical-v1")
        self.assertEqual(response.matches[0].caseStudyId, "cache-case")
        self.assertGreater(response.matches[0].score, 0)


if __name__ == "__main__":
    unittest.main()
