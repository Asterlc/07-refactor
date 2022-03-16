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
    }
}

module.exports = HeroRoutes