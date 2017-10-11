const assert = require('assert');
const app = require('../../src/app');

describe('\'thesisdb\' service', () => {
  it('registered the service', () => {
    const service = app.service('thesisdb');

    assert.ok(service, 'Registered the service');
  });
});
