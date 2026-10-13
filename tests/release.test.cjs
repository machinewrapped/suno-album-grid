const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkReleaseVersion } = require('../scripts/check-release-version.cjs');

test('release accepts matching tag, package and extension versions', () => {
  assert.equal(checkReleaseVersion('v1.0.1', '1.0.1', '1.0.1'), '1.0.1');
});

test('release rejects a mismatched package or extension version', () => {
  assert.throws(() => checkReleaseVersion('v1.0.1', '1.0.0', '1.0.1'), /must match/);
  assert.throws(() => checkReleaseVersion('v1.0.1', '1.0.1', '1.0.0'), /must match/);
});

test('release rejects tags outside the supported version format', () => {
  for (const tag of ['1.0.1', 'vnext', 'v1.0.1-rc.1', 'v1.0.1/other', undefined]) {
    assert.throws(() => checkReleaseVersion(tag, '1.0.1', '1.0.1'), /must use/);
  }
});