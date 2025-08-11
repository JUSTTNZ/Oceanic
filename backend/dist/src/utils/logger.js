import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Recreate __filename and __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create logs directory if it doesn't exist
const logsDir = join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};
const formatMessage = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        ...(Object.keys(meta).length > 0 && { meta })
    };
    return JSON.stringify(logEntry, null, 2);
};
const writeToFile = (level, content) => {
    const fileName = `${level.toLowerCase()}.log`;
    const filePath = join(logsDir, fileName);
    try {
        fs.appendFileSync(filePath, content + '\n');
    }
    catch (error) {
        console.error('Failed to write to log file:', error.message);
    }
};
const logger = {
    error: (message, meta = {}) => {
        const logContent = formatMessage(LOG_LEVELS.ERROR, message, meta);
        console.error(`❌ ERROR: ${message}`);
        if (Object.keys(meta).length > 0) {
            console.error('Meta:', JSON.stringify(meta, null, 2));
        }
        // Write to file in production
        if (process.env.NODE_ENV === 'production') {
            writeToFile(LOG_LEVELS.ERROR, logContent);
        }
    },
    warn: (message, meta = {}) => {
        const logContent = formatMessage(LOG_LEVELS.WARN, message, meta);
        console.warn(`⚠️  WARN: ${message}`);
        if (Object.keys(meta).length > 0) {
            console.warn('Meta:', JSON.stringify(meta, null, 2));
        }
        if (process.env.NODE_ENV === 'production') {
            writeToFile(LOG_LEVELS.WARN, logContent);
        }
    },
    info: (message, meta = {}) => {
        const logContent = formatMessage(LOG_LEVELS.INFO, message, meta);
        console.log(`ℹ️  INFO: ${message}`);
        if (Object.keys(meta).length > 0) {
            console.log('Meta:', JSON.stringify(meta, null, 2));
        }
        if (process.env.NODE_ENV === 'production') {
            writeToFile(LOG_LEVELS.INFO, logContent);
        }
    },
    debug: (message, meta = {}) => {
        // Only log debug messages in development
        if (process.env.NODE_ENV === 'development') {
            const logContent = formatMessage(LOG_LEVELS.DEBUG, message, meta);
            console.log(`🐛 DEBUG: ${message}`);
            if (Object.keys(meta).length > 0) {
                console.log('Meta:', JSON.stringify(meta, null, 2));
            }
        }
    },
    // HTTP request logger
    request: (req, res, responseTime) => {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || '',
            userAgent: req.get('User-Agent'),
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString()
        };
        const message = `${req.method} ${req.originalUrl} - ${res.statusCode} [${responseTime}ms]`;
        if (res.statusCode >= 400) {
            logger.error(message, logData);
        }
        else {
            logger.info(message, logData);
        }
    }
};
export { logger };
//# sourceMappingURL=logger.js.map