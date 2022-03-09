const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres');
const Context = require('../db/strategies/base/ctxStrategy');
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroiSchema');
// const ctx = new Context(new Postgres());
let ctx = {};

const MOCK_HEROI_CADASTRAR = {
    nome: ' Gavião Arqueiro',
    poder: 'Super reflexo'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Clark Kent',
    poder: 'Super jornalista'
}
const MOCK_HEROI_DELETAR = {
    nome: 'Mickey Mouse',
    poder: 'Keyblade'
}

describe('Postgres Strategy', async function () {
    this.timeout(Infinity);
    before(async function () {
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, HeroiSchema)
        // await ctx.delete(); limpar a base
        ctx = new Context(new Postgres(connection, model));
        await ctx.create(MOCK_HEROI_ATUALIZAR);
        await ctx.create(MOCK_HEROI_DELETAR);
    });

    it('Postgress Connection', async function () {
        const result = await ctx.isConnected();

        assert.equal(result, true);
    });

    it('Cadastrar um herói', async function () {
        const result = await ctx.create(MOCK_HEROI_CADASTRAR);
        delete result.id //não é possivel auto incrementar o id pelo mocha

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Listar Heroi pelo nome', async function () {
        const [result] = await ctx.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        delete result.id;

        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
    });

    it('Atualizar Herói', async function () {
        const [itemAtualizar] = await ctx.read({ nome: MOCK_HEROI_ATUALIZAR.nome });
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Superman Prime'
        };
        const result = await ctx.update(itemAtualizar.id, novoItem);

        assert.deepEqual(result.nome, novoItem.nome);
    });

    it('Deletar Mickey Mouse', async function () {
        const [itemDeletar] = await ctx.read({ nome: MOCK_HEROI_DELETAR.nome });
        const result = await ctx.delete(itemDeletar.id);

        assert.deepEqual(result, true);
    })
});