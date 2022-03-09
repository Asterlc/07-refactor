const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');
const { user, pwd } = require('../access/keyPostgres');

class Postgres extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection;
        this._schema = schema;
        // this.connect();
    }

    async create(item) {
        try {
            const { dataValues } = await this._schema.create(item, { where: item });
            return dataValues;
        } catch (error) {
            console.log('error', error);
            throw error
        }
    }

    async read(item) {
        try {
            return await this._schema.findAll({ where: item, raw: true });
        } catch (error) {
            console.log('error', error)
            throw error
        }
    }

    async update(id, item) {
        try {
            const [updateItem] = await this._schema.update(item, { where: { id: id } });
            if (updateItem === 1) return item
        } catch (error) {
            throw error
        }
    }

    async delete(id) {
        try {
            const query = id ? { id: id } : {}
            const x = await this._schema.destroy({ where: query });
            if (x === 1) return true
        } catch (error) {
            throw error
        }
    }

    static async defineModel(connection, schema) {
        try {
            const model = connection.define(
                schema.name,
                schema.schema,
                schema.options
            );
            await model.sync();

            return model;
        } catch (error) {
            console.log('error', error);
            throw error
        }
    }

    static connect() {
        const connection = new Sequelize(
            'heroes',
            `${user}`,
            `${pwd}`,
            {
                host: 'localhost', //devido ao docker neste caso
                dialect: 'postgres',
                quoteIdentifiers: false, //ignorar case sensitive
                operatorAliases: false, // erros de deprecade ignorados
                omitNull: false, //necessário para resolver id auto increment
                logging: false //retirar os logs ne execução
            }
        );

        // await this.defineModel();
        return connection;
    }

    async isConnected() {
        try {
            await this._connection.authenticate();
            return true
        } catch (error) {
            console.log('error', error);
            throw new Error('Erro de conexão com o banco postgres');
        }
    }
}

module.exports = Postgres