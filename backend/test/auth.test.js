const test = require('node:test');
const assert = require('node:assert/strict');
const { buildAuthResponse, getCookieOptions } = require('../src/utils/jwt.util');

test('buildAuthResponse returns a consistent auth payload', () => {
  const payload = buildAuthResponse({ _id: 'user-123' }, 'access-token', 'refresh-token', 'Login successful');

  assert.equal(payload.success, true);
  assert.equal(payload.message, 'Login successful');
  assert.equal(payload.access_token, 'access-token');
  assert.equal(payload.refresh_token, 'refresh-token');
  assert.deepEqual(payload.data, { _id: 'user-123' });
});

test('getCookieOptions returns production-safe cookie settings', () => {
  const options = getCookieOptions(true);

  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, 'none');
  assert.equal(options.path, '/');
});
