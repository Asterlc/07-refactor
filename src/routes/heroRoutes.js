class HeroRoutes {
    constructor(db) {
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                return this.db.read();
            }
        }
    }
}

module.exports = HeroRoutes