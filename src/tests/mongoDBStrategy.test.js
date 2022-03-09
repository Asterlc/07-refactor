const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/mongoDB');
const heroiSchema = require('../db/strategies/mongodb/schemas/heroiSchema');
const Context = require('../db/strategies/base/ctxStrategy');

const MOCK_CADASTRAR = {
    nome: 'Flash',
    poder: 'Speed'
}
const MOCK_ATUALIZAR = {
    nome: 'Bruce Wayne',
    poder: 'Dinheiro'
}
const MOCK_DELETAR = {
    nome: 'Mickey Mouse',
    poder: 'Keyblade'
}
let MOCK_OBJECT_ID = ''
// const ctx = new Context(new MongoDB());
let ctx = {};

describe('MongoDB suite de testes', async function () {
    before(async function () {
        const connection = MongoDB.connect();
        ctx = new Context(new MongoDB(connection, heroiSchema));

        // await ctx.delete({}) //limpar a base
        const att = await ctx.create(MOCK_ATUALIZAR);
        MOCK_OBJECT_ID = att._id
    });

    it('Verificar conexão', async function () {
        const result = await ctx.isConnected();

        assert.deepEqual(result, 'CONECTADO');
    });

    it('Cadastrar', async function () {
        const x = await ctx.create(MOCK_CADASTRAR);

        assert.deepEqual({ nome: x.nome, poder: x.poder }, MOCK_CADASTRAR);
    });

    it('Listar', async function () {
        const [{ nome, poder }] = await ctx.read({ nome: MOCK_CADASTRAR.nome });

        assert.deepEqual({ nome, poder }, { nome: 'Flash', poder: 'Speed' });
    });

    it('Atualizar', async function () {
        const atualizado = {
            nome: 'Batman Dark Knight',
            poder: 'Bruto'
        }
        const { nome, poder } = await ctx.update(MOCK_OBJECT_ID, atualizado);

        assert.deepEqual({ nome, poder }, { nome: 'Batman Dark Knight', poder: 'Bruto' })
    });

    it('Deletar', async function () {
        const result = await ctx.delete(MOCK_OBJECT_ID);

        assert.deepEqual(result, true);
    })
})