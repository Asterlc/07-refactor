const Sequelize = require('sequelize');
const { user, pwd } = require('../db/strategies/access/keyPostgres'); //armazenar credenciais
const driver = new Sequelize(
    'heroes',
    `${user}`,
    `${pwd}`,
    {
        host: 'localhost', //devido ao docker neste caso
        dialect: 'postgres',
        quoteIdentifiers: false, //ignorar case sensitive
        operatorAliases: false, // erros de deprecade ignorados
        omitNull: false //necessário para resolver id auto increment
    }
);

async function main() {
    try {
        const Herois = driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        })
        await Herois.sync()
        await Herois.create({
            nome: 'Lanterna Verde',
            poder: 'Energia'
        });

        const result = await Herois.findAll({ raw: true })
        console.log('result', result)
    } catch (error) {
        console.log('error', error)
        throw error
    }
}

main();