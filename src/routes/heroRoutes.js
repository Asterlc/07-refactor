const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
class HeroRoutes extends BaseRoute {
    constructor(db) {
        super(); //chamar classe pai primeiro
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;
                    let query = nome ? { $regex: `.*${nome}*.` } : {}

                    return this.db.read(query, parseInt(skip), parseInt(limit));
                } catch (error) {
                    console.log('Error heroRoutes:>>', error);
                    return 'Internal server error'
                }
            }
        }
    };

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(20),
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder });
                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }
                } catch (error) {
                    console.log('error:>>', error);
                }
            }
        }
    }
}

module.exports = HeroRoutes