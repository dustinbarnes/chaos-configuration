import * as pino from 'pino';
import * as pinoExpress from 'express-pino-logger';
import { NextFunction, Request } from 'express';
import { AppConfig } from './config';

export class Logger {
    private static instance: pino.Logger;
    private static expressInstance: NextFunction;

    // noinspection JSUnusedLocalSymbols
    private constructor() {}

    static getInstance(config? : AppConfig): pino.Logger {
        if (!Logger.instance) {
            const prettyPrint = true; //(config && config.prettyLogging) || false;
            const logLevel = (config && config.logLevel) || 'info';

            Logger.instance = pino({
                prettyPrint: prettyPrint,
                level: logLevel,
            });
        }

        return Logger.instance;
    }

    static express(config?: AppConfig): NextFunction {
        if (!Logger.expressInstance) {
            Logger.expressInstance = pinoExpress({ logger: Logger.getInstance(config) })
        }

        return Logger.expressInstance;
    }
}

export interface RequestExt extends Request {
    log: pino.Logger;
}
