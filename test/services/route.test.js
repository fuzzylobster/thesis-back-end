const assert = require('assert');
const app = require('../../src/app');

describe('\'route\' service', () => {
  it('registered the service', () => {
    const service = app.service('route');

    assert.ok(service, 'Registered the service');
  });
});
