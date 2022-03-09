const NotImplementedException = require('../../../strategy');

class ICrud {
    create(item) {
        throw new NotImplementedException();
    }

    read(query) {
        throw new NotImplementedException();
    }

    readById(query) {
        throw new NotImplementedException();
    }

    update(id) {
        throw new NotImplementedException();
    }

    delete(id) {
        throw new NotImplementedException();
    }

    isConnected() {
        throw new NotImplementedException();
    }

    connect() {
        throw new NotImplementedException();
    }
}

module.exports = ICrud