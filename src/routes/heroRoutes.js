const BaseRoute = require('./base/baseRoute');

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super(); //chamar classe pai primeiro
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;
                    let query = {};

                    if (nome) query.nome = nome;
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