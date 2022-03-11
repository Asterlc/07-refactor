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
                    return this.db.read();
                } catch (error) {
                    console.log('Error heroRoutes:>>', error);
                    return 'Serevr internal error'
                }
            }
        }
    }
}

module.exports = HeroRoutes