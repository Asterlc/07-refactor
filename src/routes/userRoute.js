const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('@hapi/boom');
const pwdHelper = require('../helpers/passwordHelper');

const createKey = process.env.REGISTER_KEY;

class UserRoute extends BaseRoute {
    constructor(db) {
        super();
        this.db = db;
    }

    create() {
        return {
            path: '/cadastro',
            method: 'POST',
            config: {
                auth: false,
                description:'Cadastrar usuário único para consulta',
                tags: ['api'],
                notes: "Todos os usuários são cadastrados em lowercase, seu username será retornado",
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    payload: Joi.object({
                        username: Joi.string().required().min(3).max(15),
                        password: Joi.string().required().min(3).max(15),
                        accessKey: Joi.string().min(7).required()
                    })
                }
            },
            handler: async (request) => {
                try {
                    let { username, password, accessKey } = request.payload
                    username = username.toLowerCase();
                    password = await pwdHelper.hashPassword(password);
                    const [user] = await this.db.read({
                        username: username
                    });
                    if (user) {
                        return Boom.unauthorized('Nome de usuário em uso');
                    };

                    if (accessKey != createKey) {
                        return Boom.unauthorized('Chave Inválida');
                    };

                    const result = await this.db.create({ username, password });
                    return {
                        message: `Usuário ${username} cadastrado com sucesso!`,
                        _id: result._id
                    };

                } catch (error) {
                    console.log('error post:>>', error);
                }
            }
        };
    }
}

module.exports = UserRoute;