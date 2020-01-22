import * as env from 'env-var';
import * as dotenv from 'dotenv';

require('pkginfo')(module, 'version');
const version = module.exports.version;

// Non-ironically not using your own config engine? Ok.
export class AppConfig {
    // Just to make it easy to output it somewhere.
    readonly version: string = version;

    // Default port
    readonly port: number = env.get('HTTP_PORT', '8080').asPortNumber();

    readonly db: any = this.getDatabase();

    // Print logs as formatted JSON. On by default in non-prod environments.
    readonly prettyLogging: boolean = env.get('NODE_ENV', 'non-prod').asString() !== 'production';

    // Default logging level
    readonly logLevel: string = env.get('LOG_LEVEL', 'info').asString();

    // If you basically want to add a context root (like /config/foo/bar/api/client)
    readonly baseUriPath: string = env.get('BASE_URI_PATH', '').asString();

    // Session secret -- not too useful right now, but maybe later?
    readonly sessionSecret: string = env.get('SESSION_SECRET', 'this-is-insecure-default').asString();

    // JWT Secret
    readonly jwtSecret: string = env.get('JWT_SECRET', 'this-is-also-really-insecure').asString();

    getDatabase(): any {
        const env = process.env.NODE_ENV || 'development';
        const dbConnectionInfo = require('../knexfile');

        if (dbConnectionInfo[env]) {
            return dbConnectionInfo[env];
        } else {
            throw new Error(`knexfile did not contain entry for ${env}`);
        }
    }
}

export function getConfig(): AppConfig {
    // Allow for .env file usage. 
    dotenv.config({path: '.env' || '.env.example'});

    return new AppConfig();
}
