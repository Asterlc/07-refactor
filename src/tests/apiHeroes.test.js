const assert = require('assert');
const server = require('./../api');
let app = {};
describe.only('Suite de testes da API', function () {
    before(async () => {
        app = await server
    });

    it('listar /herois', async function () {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        });
        const data = await JSON.parse(result.payload); //converte para um obj javascript
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));
    });
});