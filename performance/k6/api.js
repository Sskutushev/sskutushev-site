import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    steady_read: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '20s',
      preAllocatedVUs: 5,
      maxVUs: 20,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    checks: ['rate>0.99'],
  },
};

const baseUrl = __ENV.K6_BASE_URL || 'http://127.0.0.1:4000';
const query = JSON.stringify({
  query: 'query PortfolioProbe { portfolioData(locale: EN) { profile { fullName version } } }',
});

export default function () {
  const response = http.post(`${baseUrl}/graphql`, query, {
    headers: { 'content-type': 'application/json' },
    tags: { operation: 'PortfolioProbe' },
  });
  check(response, {
    'GraphQL returns 200': (result) => result.status === 200,
    'portfolio contract is present': (result) =>
      result.json('data.portfolioData.profile.fullName') !== undefined,
    'no GraphQL errors': (result) => result.json('errors') === undefined,
  });
}
