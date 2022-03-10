const Hapi = require('@hapi/hapi');
const Context = require('./db/strategies/base/ctxStrategy');
const MongoDB = require('./db/strategies/mongodb/mongoDB');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema');
const BaseRoute = require('./routes/base/baseRoute');
const HeroRoute = require('./routes/heroRoutes');
const server = new Hapi.server({
    port: 8050 || process.env.PORT
});

function mapRoutes(instance, methods) {
    // methods = ['list'] // funciona
    //methods é um array com os métodos CRUD da instancia da classe usada
    return methods.map(method => instance[method]());

}


async function main() {
    const connection = MongoDB.connect();
    const ctx = new Context(new MongoDB(connection, HeroiSchema));
    await server.route([
        ...mapRoutes(new HeroRoute(ctx), HeroRoute.methods())
    ]);
    
    await server.start();
    console.log(`Server listen on port: ${server.info.port}`);
    return server;
}

module.exports = main();

// main();