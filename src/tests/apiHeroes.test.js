const assert = require('assert');
const server = require('./../api');
// const authUser = require('../routes/authRoute');
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoxLCJpYXQiOjE2NDgzMTQ4OTB9.5mD5FGDPkVDVKNArsvGQBmfVJkbbFhSkfKge430-LQc"
const headers = {
    authorization: TOKEN
};
let app = {};
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin',
    poder: 'Marreta Biônica'
};
const MOCK_HEROI_CADASTRAR_PROD = {
    nome: 'Barry Allen',
    poder: 'Speed'
};

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Sora',
    poder: 'Poder'
};
const MOCK_HEROI_DELETAR = {
    nome: 'Libélula',
    poder: 'Comédia'
};

let MOCK_ID = '';
let MOCK_ID_DELETAR = '';

describe('Suite de testes da API', function () {
    before(async function () {
        app = await server;
        await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_CADASTRAR_PROD)
        });

        const resultUpdate = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_ATUALIZAR)
        });

        const dataUpdate = JSON.parse(resultUpdate.payload);
        MOCK_ID = dataUpdate._id;

        const resultDelete = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: JSON.stringify(MOCK_HEROI_DELETAR)
        });
        const dataDelete = JSON.parse(resultDelete.payload);
        MOCK_ID_DELETAR = dataDelete._id;
    });

    it.only('listar /herois', async function () {
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10',
            headers,
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
            url: `/herois?skip=0&limit=${limit}`,
            headers,
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
            url: `/herois?skip=0&limit=${limit}&nome=${nome}`,
            headers,
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
            url: `/herois?skip=0&limit=${limit}`,
            headers,
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
            payload: MOCK_HEROI_CADASTRAR,
            headers,
        });
        const statusCode = result.statusCode;
        const { message, _id } = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined); //testa se a propriedade _id não está undefined
        assert.deepEqual(message, 'Heroi cadastrado com sucesso!');
    });

    it('Atualizar um heroi PATCH - /herois/:id ', async () => {
        const expected = {
            poder: 'Keyblade'
        };

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}`,
            headers,
            payload: JSON.stringify(expected)
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);
        assert.ok(statusCode === 200);
        assert.deepEqual(data.message, 'Heroi atualizado com sucesso!');
    });

    it('Não deve atualizar um heroi PATCH - ID INCORRETO', async () => {
        MOCK_ID = "623bdb92820385c4bb92709a" //id deletado da base
        const expected = {
            poder: 'Keyblade'
        };

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}`,
            headers,
            payload: JSON.stringify(expected)
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepEqual(data.message, 'Não foi possível atualizar');
    });

    it("Deletar um heroi - /heroi/:id", async () => {
        const expected = { message: 'Heroi removido com sucesso!' };
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID_DELETAR}`,
            headers,
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);

        assert.ok(statusCode === 200);
        assert.deepEqual(data.message, expected.message);
    });
});