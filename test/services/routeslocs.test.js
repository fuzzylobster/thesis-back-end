const assert = require('assert');
const app = require('../../src/app');

describe('\'routeslocs\' service', () => {
  it('registered the service', () => {
    const service = app.service('routeslocs');

    assert.ok(service, 'Registered the service');
  });
});
