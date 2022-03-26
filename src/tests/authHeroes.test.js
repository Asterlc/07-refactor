const assert = require('assert');
const api = require('./../api');
const Context = require('../db/strategies/base/ctxStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const userSchema = require('../db/strategies/postgres/schemas/usuarioSchema');

let app = {};

const MOCK_USER = {
    username: 'tester',
    password: 'Asterlc@123456'
}
const MOCK_USER_DB = {
    username: MOCK_USER.username.toLowerCase(),
    password: '$2b$04$WD.SLwCAWgWjDoOFAY7Qcu43fzmT4tHjrKBQ33S3RSPk3McLdKaT.'
}

describe('Auth test suite', function () {
    this.beforeAll(async function () {
        app = await api;

        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, userSchema); // cria tb_usuarios
        const postgresCTX = new Context(new Postgres(connection, model));
        await postgresCTX.update(1, MOCK_USER_DB, true);
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

    it('Deve retornar não autorizado', async () => {
        MOCK_USER.password = '123456'
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: MOCK_USER
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);

        assert.deepEqual(data.message, 'Usuario ou senha inválido!');
        assert.ok(statusCode === 401);
    });
});