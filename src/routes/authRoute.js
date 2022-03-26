const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');


const MOCK_USER = {
    username: 'tester',
    password: '123456'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super();
        this.secret = secret;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Faz login com usuário e senha',
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                },
                handler: async (request) => {
                    const { username, password } = request.payload;

                    if (username.toLowerCase() !== MOCK_USER.username || password !== MOCK_USER.password) {
                        return Boom.unauthorized();
                    };
                    //Simula um usuário no banco, passando uma chave secreta.
                    const token = JWT.sign({
                        username: username, id: 1
                    }, this.secret);

                    return {
                        token
                    };// o mesmo que {token:token}
                }
            }
        }
    }
}

module.exports = AuthRoutes;