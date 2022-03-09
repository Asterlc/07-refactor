class NotImplementedException extends Error {
    constructor() {
        super('Not Implemented Exception');
    }
}

module.exports = NotImplementedException

// class ICrud {
//     create(item) {
//         throw new NotImplementedException();
//     }

//     read(query) {
//         throw new NotImplementedException();
//     }

//     update(id) {
//         throw new NotImplementedException();
//     }

//     delete(id) {
//         throw new NotImplementedException();
//     }
// }

// class MongoDB extends ICrud {
//     constructor() {
//         super();
//     }

//     create(item) {
//         console.log('item salvo em mongodb');
//     }
// }

// class Postgress extends ICrud {
//     constructor() {
//         super();
//     }

//     create(item) {
//         console.log('item salvo me postgress');
//     }
// }

// class ContentStrategy { //classe abstrata
//     constructor(strategy) {
//         this._database = strategy;
//     }

//     create(item) {
//         return this._database.create(item);
//     }

//     read(item) {
//         return this._database.read(item);
//     }

//     update(id, item) {
//         return this._database.update(id, item);
//     }

//     delete(id, item) {
//         return this._database.delete(id);
//     }
// }

// const ctxMongo = new ContentStrategy(new MongoDB());
// const ctxPostgress = new ContentStrategy(new Postgress());

// ctxMongo.create();
// ctxPostgress.create();
// ctxMongo.read(); ERROR