const forever = require('forever-monitor');
const path = require('path');
const logger = require('./logger');

const child = new(forever.Monitor)(path.join(__dirname, 'bin/www'), {
    watch: process.env.NODE_ENV == "development",
    watchDirectory: __dirname,
    minUptime: 10000
});

child.on('watch:restart', function (info) {
    logger.info('Restaring script because ' + info.file + ' changed');
});

child.on('restart', function () {
    logger.info('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function (code) {
    logger.error('Forever detected script exited with code ' + code);
});

child.start();