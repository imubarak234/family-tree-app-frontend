import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeNewsQueryParams,
  normalizeEventsQueryParams,
  normalizeTimelineQueryParams,
} from './queryParams.js';

test('normalizeNewsQueryParams normalizes booleans and pagination', () => {
  const params = normalizeNewsQueryParams({
    search: '  reunion  ',
    status: 'Published',
    pinnedOnly: 'true',
    page: '2',
    limit: '10',
  });

  assert.equal(params.search, 'reunion');
  assert.equal(params.pinnedOnly, true);
  assert.equal(params.page, 2);
  assert.equal(params.limit, 10);
});

test('normalizeEventsQueryParams handles invalid pagination fallback', () => {
  const params = normalizeEventsQueryParams({
    upcoming: 'false',
    past: true,
    page: '0',
    limit: '-1',
  });

  assert.equal(params.upcoming, false);
  assert.equal(params.past, true);
  assert.equal(params.page, 1);
  assert.equal(params.limit, 20);
});

test('normalizeTimelineQueryParams converts dates to ISO', () => {
  const params = normalizeTimelineQueryParams({
    sourceType: 'NewsPost',
    memberId: 'abc',
    from: '2026-01-01',
    to: '2026-12-31',
  });

  assert.equal(params.sourceType, 'NewsPost');
  assert.equal(params.memberId, 'abc');
  assert.match(params.from, /^2026-01-01/);
  assert.match(params.to, /^2026-12-31/);
});
