const assert = require('assert');
const server = require('./../api');
let app = {};
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin',
    poder: 'Marreta Biônica'
};

describe('Suite de testes da API', function () {
    before(async function () {
        app = await server
    });

    it('listar /herois', async function () {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=0'
        });
        const data = JSON.parse(result.payload); //converte para um obj javascript
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data)); //confirmar se os dados são arrays

    });

    it('Listar herois - retornar somente 3 registros', async function () {
        const limit = 3;
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${limit}`
        });
        
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(statusCode, 200);
        assert.ok(data.length === limit);
    });

    it('Listar herois - filtrar um item', async function () {
        const limit = 3;
        const nome = 'Barry Allen';
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${limit}&nome=${nome}`
        });
        const [data] = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(data.nome, nome);
        assert.ok(statusCode === 200);
    });

    it('Listar herois - retornar Erro interno', async function () {
        const limit = 'AEEEE';
        const errMessage = 'Bad Request'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${limit}`
        });
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        assert.deepEqual(data.error, errMessage);
        assert.ok(statusCode === 400);
    });

    it('Cadastrar herois POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: MOCK_HEROI_CADASTRAR
        });
        console.log('result', result.payload);
        const statusCode = result.statusCode;
        const { message } = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.notDeepStrictEqual(_id, undefined); // testa se a propriedade _id não está undefined
        assert.deepEqual(message , 'Heroi cadastrado com sucesso!');
    });
});