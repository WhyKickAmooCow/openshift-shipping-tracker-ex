const config = require('config');
const logger = require('./logger');
const Client = require('pg').Client;

dbConf = config.get('db');

const client = new Client({
    user: dbConf.get('user'),
    host: dbConf.get('host'),
    database: dbConf.get('database'),
    password: dbConf.get('password'),
    port: dbConf.get('port')
});

client.connect().catch(function (err) {
    logger.error(err);
    process.abort();
});

module.exports = client;