const mongoose = require('mongoose');
const { user, pwd } = require('../db/strategies/access/keyMongodb'); //armazenar credenciais

const connect = async () => {
    await mongoose.connect(`mongodb://${user}:${pwd}@localhost:27017/herois`, { useNewUrlParser: true })
        .then(() => console.log('Conectado ao MongoDB'))
        .catch((error) => console.log('Falha para conectar ao mongoDB', error))
}

connect();

const heroisSchema = new mongoose.Schema({
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

const model = mongoose.model('herois', heroisSchema);

async function main() {
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    });
    console.log('resultCadastrar', resultCadastrar)

    const listItens = await model.find()
    console.log('listItens', listItens)
}

main();