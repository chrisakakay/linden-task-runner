'use strict';

const taskRunner = require('./index');

describe('Task runner', function() {
    it('should fail on empty config', function() {
        expect(taskRunner.init({ cases: [] })).toBe(false);
    });
});
