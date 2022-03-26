const Hapi = require('@hapi/hapi');
//Gerencia as estratégias
const Context = require('./db/strategies/base/ctxStrategy');
//Bancos
const MongoDB = require('./db/strategies/mongodb/mongoDB');
//Models
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema');
//Rotas
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoute');


//Plugins
const HapiSwagger = require('hapi-swagger');
const HapiVision = require('@hapi/vision');
const HapiInert = require('@hapi/inert');
const HapiAuthJWT2 = require('hapi-auth-jwt2');

const JWT_SECRET = 'abacate';

const server = new Hapi.server({
    port: 8050 || process.env.PORT
});

//methods é um array com os métodos CRUD da instancia da classe usada
function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
};

async function main() {
    const connection = MongoDB.connect();
    const ctx = new Context(new MongoDB(connection, HeroiSchema));

    const swaggerOptions = {
        info: {
            title: 'API Herois - Imersão NodeJS',
            version: 'v1.0'
        }
    };

    //Registro dos plugins usados na aplicação.
    await server.register([
        HapiAuthJWT2,
        HapiVision,
        HapiInert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (data, request) => {
            return {
                isValid: true
            }
        }
    });

    server.auth.default('jwt');

    await server.route([
        ...mapRoutes(new HeroRoute(ctx), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
    ]);

    await server.start();
    console.log(`Server listen on port: ${server.info.port}`);
    return server;
};

module.exports = main();