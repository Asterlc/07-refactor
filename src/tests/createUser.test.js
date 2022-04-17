const assert = require('assert');
const api = require('./../api');
const Context = require('../db/strategies/base/ctxStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const userSchema = require('../db/strategies/postgres/schemas/usuarioSchema');
const registerKey = process.env.REGISTER_KEY;

let app = {};

const MOCK_USER = {
    username: 'first',
    password: 'aster@123456',
    accessKey: registerKey
}
const MOCK_USER_FAIL = {
    username: 'failFirst',
    password: 'aster@123456',
    accessKey: 'abcdefg'
}

const ASTER = {
    username: 'tester',
    password: 'Asterlc@123456',
    accessKey: registerKey
}

describe('Create User Suite', function () {
    this.beforeAll(async function () {
        app = await api;

        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, userSchema);
        const postgresCTX = new Context(new Postgres(connection, model));
    });

    it('Deve criar um usuário', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/cadastro',
            payload: JSON.stringify(MOCK_USER)
        });
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
    });

    it('Chave inválida', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/cadastro',
            payload: JSON.stringify(MOCK_USER_FAIL)
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);

        assert.deepEqual(data.message, 'Chave Inválida');
        assert.ok(statusCode, 401);
    });

    it('Não deve cadastrar usuário existente', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/cadastro',
            payload: JSON.stringify(ASTER)
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);

        assert.deepEqual(data.message, 'Nome de usuário em uso');
        assert.ok(statusCode, 401);
    });
});