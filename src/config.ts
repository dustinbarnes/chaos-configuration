
require('pkginfo')(module, 'version');
const version = module.exports.version;

// Non-ironically not using your own config engine? Ok.

export class ConfigConfig {
    // Just to make it easy to output it somewhere.
    readonly version: string = version;

    //database: string = "mysql://user:password@localhost/test";

    // Default port
    port: number = 8080;

    // Print logs as formatted JSON. On by default in non-prod environments.
    prettyLogging: boolean = !process.env.NODE_ENV || process.env.NODE_ENV != 'production';

    // Default logging level
    logLevel: string = "info";

    // If you basically want to add a context root (like /config/foo/bar/api/client)
    baseUriPath: string = "";
}

function defaultOptions() {
    return new ConfigConfig();
}

export function getConfig(opts: any): ConfigConfig {
    return { ...defaultOptions(), ...opts };
}
