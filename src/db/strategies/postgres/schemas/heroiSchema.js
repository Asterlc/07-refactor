const Sequelize = require('sequelize');

const heroiSchema = {
    name: 'herois',
    schema:
    {
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
    },
    options:
    {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false

    }
}
module.exports = heroiSchema


// this._herois = this._driver.define('herois', {
//     id: {
//         type: Sequelize.INTEGER,
//         required: true,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     nome: {
//         type: Sequelize.STRING,
//         required: true
//     },
//     poder: {
//         type: Sequelize.STRING,
//         required: true
//     }
// }, {
//     tableName: 'TB_HEROIS',
//     freezeTableName: false,
//     timestamps: false
// });

// await this._herois.sync();