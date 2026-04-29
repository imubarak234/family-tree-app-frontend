import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canViewNews,
  canCreateNews,
  canUpdateNews,
  canDeleteNews,
  canPublishNews,
  canPinNews,
  canViewEvents,
  canCreateEvent,
  canUpdateEvent,
  canDeleteEvent,
  canCreateRsvp,
  canUpdateRsvp,
  canDeleteRsvp,
  canCreateComment,
  canEditOwnComment,
  canDeleteOwnComment,
  canModerateComments,
  canCreateReaction,
  canDeleteOwnReaction,
  canDeleteReaction,
  canViewTimeline,
} from './permissions.js';

const user = {
  id: 'u1',
  roles: ['User'],
  permissions: [
    'view:news',
    'create:news',
    'update:news',
    'delete:news',
    'publish:news',
    'pin:news',
    'view:events',
    'create:event',
    'update:event',
    'delete:event',
    'create:rsvp',
    'update:rsvp',
    'delete:rsvp',
    'create:comment',
    'update:own_comment',
    'delete:own_comment',
    'update:comment',
    'delete:comment',
    'create:reaction',
    'delete:own_reaction',
    'delete:reaction',
    'view:timeline',
  ],
};

test('social permission helpers map to expected permission strings', () => {
  assert.equal(canViewNews(user), true);
  assert.equal(canCreateNews(user), true);
  assert.equal(canUpdateNews(user), true);
  assert.equal(canDeleteNews(user), true);
  assert.equal(canPublishNews(user), true);
  assert.equal(canPinNews(user), true);

  assert.equal(canViewEvents(user), true);
  assert.equal(canCreateEvent(user), true);
  assert.equal(canUpdateEvent(user), true);
  assert.equal(canDeleteEvent(user), true);

  assert.equal(canCreateRsvp(user), true);
  assert.equal(canUpdateRsvp(user), true);
  assert.equal(canDeleteRsvp(user), true);

  assert.equal(canCreateComment(user), true);
  assert.equal(canEditOwnComment(user), true);
  assert.equal(canDeleteOwnComment(user), true);
  assert.equal(canModerateComments(user), true);

  assert.equal(canCreateReaction(user), true);
  assert.equal(canDeleteOwnReaction(user), true);
  assert.equal(canDeleteReaction(user), true);

  assert.equal(canViewTimeline(user), true);
});
