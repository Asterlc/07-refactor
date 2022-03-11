const ICrud = require('./../interfaces/interfaceCrud');
const mongoose = require('mongoose');
const { user, pwd } = require('../access/keyMongodb');
const statusDictionary = {
    0: 'DESCONECTADO',
    1: 'CONECTADO',
    2: 'CONECTANDO',
    3: 'DESCONECTANDO'
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super();
        // this.connect();
        this._connection = connection;
        this._schema = schema;
    }

    async isConnected() {
        const state = statusDictionary[mongoose.connection.readyState];
        if (state === 'CONECTADO') return state;
        if (state != 'CONECTANDO') return state;

        // await this.connect();

        return statusDictionary[mongoose.connection.readyState];
    }

    static connect() { // métodos static não são instanciaveis
        mongoose.connect(`mongodb://${user}:${pwd}@localhost:27017/herois`, { useNewUrlParser: true }, function (error) {
            if (!error) return;
            console.log('Falha para conectar ao MongoDB:>>>', error);
        });

        const connection = mongoose.connection;

        connection.once('open', () => console.log('Conectado ao MongoDB'));
        return connection;
    }

    defineModel() {
        const heroiSchema = new mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        });

        this._schema = mongoose.model('herois', heroiSchema);
    }

    async create(item) {
        // this.defineModel();
        return await this._schema.create(item);
    }

    async read(item, skip = 0, limit = 10) {
        // this.defineModel();
        return await this._schema.find(item).skip(skip).limit(limit);
    }

    async update(id, item) {
        // this.defineModel();
        const r = await this._schema.updateOne({ _id: id }, { $set: item });
        if (r.acknowledged === true && r.modifiedCount === 1) return item
        return false
    }

    async delete(id) {
        // this.defineModel();
        const r = await this._schema.deleteOne({ _id: id });
        if (r.acknowledged === true && r.deletedCount === 1) return true
        return false
    }


}

module.exports = MongoDB
