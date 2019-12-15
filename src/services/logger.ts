import winston from 'winston'

const logger = winston.createLogger({
    level: process.env.EVOLAUNCHER_LOGGING_LEVEL,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'all.log', level: process.env.EVOLAUNCHER_LOGGING_LEVEL })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.json(),
        level: process.env.EVOLAUNCHER_LOGGING_LEVEL
    }));
}

// @ts-ignore
logger.error = console.error;

export default logger;