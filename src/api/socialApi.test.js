import test from 'node:test';
import assert from 'node:assert/strict';
import apiClient from './client.js';
import { newsAPI } from './news.js';
import { eventsAPI } from './events.js';
import { engagementAPI } from './engagement.js';
import { timelineAPI } from './timeline.js';

function withMockedApiClient(mock, fn) {
  const originals = {};
  Object.keys(mock).forEach((key) => {
    originals[key] = apiClient[key];
    apiClient[key] = mock[key];
  });

  try {
    fn();
  } finally {
    Object.keys(mock).forEach((key) => {
      apiClient[key] = originals[key];
    });
  }
}

test('news API uses expected endpoints', () => {
  const calls = [];
  withMockedApiClient(
    {
      get: (url, options) => calls.push(['get', url, options]),
      post: (url, payload) => calls.push(['post', url, payload]),
      put: (url, payload) => calls.push(['put', url, payload]),
      delete: (url) => calls.push(['delete', url]),
    },
    () => {
      newsAPI.list({ search: 'hello' });
      newsAPI.getById('n1');
      newsAPI.create({ title: 'X' });
      newsAPI.update('n1', { title: 'Y' });
      newsAPI.delete('n1');
      newsAPI.publish('n1');
      newsAPI.unpublish('n1');
      newsAPI.pin('n1');
      newsAPI.unpin('n1');
    }
  );

  assert.deepEqual(calls[0], ['get', '/news', { params: { search: 'hello' } }]);
  assert.deepEqual(calls[1], ['get', '/news/n1', undefined]);
  assert.deepEqual(calls[5], ['post', '/news/n1/publish', undefined]);
  assert.deepEqual(calls[8], ['post', '/news/n1/unpin', undefined]);
});

test('events API uses expected endpoints including RSVP routes', () => {
  const calls = [];
  withMockedApiClient(
    {
      get: (url, options) => calls.push(['get', url, options]),
      post: (url, payload) => calls.push(['post', url, payload]),
      put: (url, payload) => calls.push(['put', url, payload]),
      delete: (url) => calls.push(['delete', url]),
    },
    () => {
      eventsAPI.list({ upcoming: true });
      eventsAPI.getById('e1');
      eventsAPI.create({ title: 'Event' });
      eventsAPI.update('e1', { title: 'Event 2' });
      eventsAPI.delete('e1');
      eventsAPI.getRsvps('e1');
      eventsAPI.createRsvp('e1', { status: 'Going' });
      eventsAPI.updateRsvp('e1', { status: 'Maybe' });
      eventsAPI.deleteRsvp('e1');
    }
  );

  assert.deepEqual(calls[0], ['get', '/events', { params: { upcoming: true } }]);
  assert.deepEqual(calls[5], ['get', '/events/e1/rsvps', undefined]);
  assert.deepEqual(calls[8], ['delete', '/events/e1/rsvp']);
});

test('engagement API validates resource and uses correct paths', () => {
  const calls = [];
  withMockedApiClient(
    {
      get: (url) => calls.push(['get', url]),
      post: (url, payload) => calls.push(['post', url, payload]),
      put: (url, payload) => calls.push(['put', url, payload]),
      delete: (url) => calls.push(['delete', url]),
    },
    () => {
      engagementAPI.getComments('news', '1');
      engagementAPI.createComment('events', '2', { content: 'Hi' });
      engagementAPI.updateComment('c1', { content: 'Edit' });
      engagementAPI.deleteComment('c1');
      engagementAPI.getReactions('news', '1');
      engagementAPI.createReaction('events', '2', { reactionType: 'Like' });
      engagementAPI.deleteReaction('r1');
    }
  );

  assert.deepEqual(calls[0], ['get', '/news/1/comments']);
  assert.deepEqual(calls[5], ['post', '/events/2/reactions', { reactionType: 'Like' }]);
  assert.throws(() => engagementAPI.getComments('invalid', '1'), /Invalid resource/);
});

test('timeline API uses expected endpoint', () => {
  const calls = [];
  withMockedApiClient(
    {
      get: (url, options) => calls.push(['get', url, options]),
    },
    () => {
      timelineAPI.list({ sourceType: 'Event' });
    }
  );

  assert.deepEqual(calls[0], ['get', '/timeline', { params: { sourceType: 'Event' } }]);
});
