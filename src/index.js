const ContextStrategy = require('./db/strategies/base/ctxStrategy');
const MongoDB = require('./db/strategies/mongoDB/mongoDB');
const Postgres = require('./db/strategies/postgres/postgres.js');

const ctxMongo = new ContextStrategy(new MongoDB());
const ctxPostgress = new ContextStrategy(new Postgres());

ctxMongo.create();
ctxPostgress.create();
