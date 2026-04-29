import test from 'node:test';
import assert from 'node:assert/strict';
import {
  newsCreateSchema,
  eventCreateSchema,
  rsvpSchema,
  commentCreateSchema,
  reactionCreateSchema,
} from './validation.js';

test('newsCreateSchema validates required fields and min lengths', async () => {
  const valid = await newsCreateSchema.isValid({
    title: 'Family reunion announced',
    content: 'This is enough content for validation.',
    status: 'Draft',
  });

  const invalid = await newsCreateSchema.isValid({
    title: 'No',
    content: 'short',
  });

  assert.equal(valid, true);
  assert.equal(invalid, false);
});

test('eventCreateSchema enforces end date after start date', async () => {
  const valid = await eventCreateSchema.isValid({
    title: 'Picnic',
    description: 'Family picnic event description',
    startsAt: '2026-05-01T10:00:00.000Z',
    endsAt: '2026-05-01T12:00:00.000Z',
  });

  const invalid = await eventCreateSchema.isValid({
    title: 'Picnic',
    description: 'Family picnic event description',
    startsAt: '2026-05-01T10:00:00.000Z',
    endsAt: '2026-05-01T09:00:00.000Z',
  });

  assert.equal(valid, true);
  assert.equal(invalid, false);
});

test('rsvp/comment/reaction schemas validate payload contracts', async () => {
  assert.equal(await rsvpSchema.isValid({ status: 'Going', guestCount: 2 }), true);
  assert.equal(await rsvpSchema.isValid({ status: 'InvalidStatus' }), false);

  assert.equal(await commentCreateSchema.isValid({ content: 'Nice update!' }), true);
  assert.equal(await commentCreateSchema.isValid({ content: '' }), false);

  assert.equal(await reactionCreateSchema.isValid({ reactionType: 'Like' }), true);
  assert.equal(await reactionCreateSchema.isValid({ reactionType: 'Angry' }), false);
});
