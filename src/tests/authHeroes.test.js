const assert = require('assert');
const api = require('./../api');
let app = {};

const MOCK_USER = {
    username: 'tester',
    password: '123456'
}

describe('Auth test suite', function () {
    this.beforeAll(async function () {
        app = await api;
    });

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: MOCK_USER
        });

        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);       
      
        assert.deepEqual(statusCode, 200);
        assert.ok(data.token.length > 10);
    });

    it('deve verificar um JWT válido.', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: MOCK_USER
        });

        // const statusCode = result.statusCode;
        // const data = JSON.parse(result.payload);
      
        // assert.deepEqual(statusCode, 200);
        // assert.ok(data.token.length > 10);
    });
});