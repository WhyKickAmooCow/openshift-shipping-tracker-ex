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

async function x() {
    try {
        await client.connect();

        logger.log("Successfully connected to database");

        // client.on('error', (err) => {
        //     logger.error(err);
        // });

        client.on('end', () => {
            logger.error('Disconnected from database');
            process.exit();
        });
    } catch (err) {
        logger.error("Failed to connect to the database");
        logger.error(err);
        process.abort();
    }
}

x();

module.exports = client;