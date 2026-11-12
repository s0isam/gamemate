const test = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');
const schemas = require('../validation/schemas');
const validateRequest = require('../middleware/validateRequest');

test('registration requires a valid email and an eight-character password', () => {
  const invalid = schemas.authRegister.body.safeParse({
    username: 'Player',
    email: 'not-an-email',
    password: 'short',
  });
  const valid = schemas.authRegister.body.safeParse({
    username: 'Player',
    email: 'player@example.com',
    password: 'strongpass',
  });

  assert.equal(invalid.success, false);
  assert.equal(valid.success, true);
});

test('profile validation strips fields outside the public profile schema', () => {
  const request = { body: { username: 'Player', isAdmin: true } };
  let nextError;

  validateRequest(schemas.profileUpdate)(request, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError, undefined);
  assert.deepEqual(request.body, { username: 'Player' });
});

test('invalid request data is returned as a client validation error', () => {
  const request = { body: { latitude: 91, longitude: 0 } };
  let nextError;

  validateRequest(schemas.locationUpdate)(request, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError.statusCode, 400);
  assert.equal(nextError.details[0].path, 'latitude');
});

test('nearby discovery bounds its radius and supplies a default result limit', () => {
  const validQuery = schemas.nearbyGamers.query.safeParse({});
  const invalidQuery = schemas.nearbyGamers.query.safeParse({ radius: 101 });

  assert.equal(validQuery.success, true);
  assert.equal(validQuery.data.radius, 10);
  assert.equal(invalidQuery.success, false);
});

test('chat requests validate bounded page and page-size values', () => {
  const validQuery = schemas.chatQuery.query.safeParse({});
  const invalidQuery = schemas.chatQuery.query.safeParse({ page: 0, limit: 101 });

  assert.equal(validQuery.success, true);
  assert.deepEqual(validQuery.data, { page: 1, limit: 100 });
  assert.equal(invalidQuery.success, false);
});

test('new users do not receive a fabricated [0, 0] location', () => {
  assert.equal(new User().location, undefined);
});
