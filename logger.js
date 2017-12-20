const { Logger, transports } = require('winston');

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new Logger({
  transports: [
    new transports.Console({
        timestamp: tsFormat,
        colorize: true,
        level: 'debug'
    })
]
});

logger.stream = { 
    write: function(message, encoding){ 
      logger.info(message); 
    } 
}; 

module.exports = logger;