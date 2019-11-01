import * as bodyParser from 'body-parser'
import { Server as BaseServer } from '@overnightjs/core'
import { ConfigConfig, getConfig } from './config';
import { HealthController } from './controller';
import { EventEmitter } from 'events';
import { Logger } from './logger';
//import { Keyv } from 'keyv';

export class Server extends BaseServer {
    private appConfig: ConfigConfig;
    private readonly eventBus: EventEmitter;

    constructor(config: ConfigConfig) {
        super();

        this.appConfig = getConfig(config);
        //const keyv = new Keyv();

        this.app.locals.appConfig = this.appConfig;
        this.app.use(Logger.express(config));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.set('trust proxy', true);
        this.app.disable('x-powered-by');
        this.app.set('port', this.appConfig.port);
        this.app.locals.baseUriPath = this.appConfig.baseUriPath;

        this.eventBus = new EventEmitter();

        super.addControllers([
            new HealthController(),
        ]);
    }

    public start(): Promise<any> {
        const server = this.app.listen(this.appConfig.port);
        const scopedApp = this.app;
        const scopedEventBus = this.eventBus;

        return new Promise((resolve, reject) => {
            server.on('listening', () =>
                resolve({
                    scopedApp,
                    server,
                    scopedEventBus,
                })
            );
            server.on('error', reject);
        });
    }
}
