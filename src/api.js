//Configurações de ambiente
const { config } = require('dotenv');
const { join } = require('path'); // nativo NodeJS
const { ok } = require('assert');
const env = process.env.NODE_ENV || "dev";
ok(env === 'prod' || env === 'dev', 'A env é inválida. Ou .prod ou .dev')
const configPath = join(__dirname,'./config', `.env.${env}`);
console.log('CurrentEnv:>>', env);
config({
    path: configPath
});
//Lib de roteamento
const Hapi = require('@hapi/hapi');
//Gerenciamento das estratégias
const Context = require('./db/strategies/base/ctxStrategy');
//Bancos
const MongoDB = require('./db/strategies/mongodb/mongoDB');
const Postgres = require('./db/strategies/postgres/postgres');
//Models
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema');
//Rotas
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoute');
//Plugins
const HapiSwagger = require('hapi-swagger');
const HapiVision = require('@hapi/vision');
const HapiInert = require('@hapi/inert');
const HapiAuthJWT2 = require('hapi-auth-jwt2');
//JWT SECRETs
const JWT_SECRET = process.env.JWT_KEY

const server = new Hapi.server({
    port: 8050 || process.env.PORT
});

//methods é um array com os métodos CRUD da instancia da classe usada
function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
};

async function main() {
    const connectionMongoDB = MongoDB.connect();
    const ctxMongoDB = new Context(new MongoDB(connectionMongoDB, HeroiSchema));

    const connectionPostgres = Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    const ctxPostgres = new Context(new Postgres(connectionPostgres, model));


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
        ...mapRoutes(new HeroRoute(ctxMongoDB), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, ctxPostgres), AuthRoute.methods()) //usuários salvos em postgres
    ]);

    await server.start();
    console.log(`Server listen on port: ${server.info.port}`);
    return server;
};

module.exports = main();