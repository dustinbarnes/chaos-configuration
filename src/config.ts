import * as env from 'env-var';

require('pkginfo')(module, 'version');
const version = module.exports.version;

// Non-ironically not using your own config engine? Ok.
export class ConfigConfig {
    // Just to make it easy to output it somewhere.
    readonly version: string = version;

    readonly dbUrl: string = env.get('DB_URL', '').asString();

    // Default port
    readonly port: number = env.get('HTTP_PORT', '8080').asPortNumber();

    // Print logs as formatted JSON. On by default in non-prod environments.
    readonly prettyLogging: boolean = env.get('NODE_ENV', 'non-prod').asString() !== 'production';

    // Default logging level
    readonly logLevel: string = env.get('LOG_LEVEL', 'info').asString();

    // If you basically want to add a context root (like /config/foo/bar/api/client)
    readonly baseUriPath: string = env.get('BASE_URI_PATH', '').asString();
}

export function getConfig(): ConfigConfig {
    return new ConfigConfig;
}
