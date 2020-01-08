import * as bodyParser from 'body-parser'
import { Server as BaseServer } from '@overnightjs/core'
import { ConfigConfig, getConfig } from './config';
import { HealthController } from './controller';
import { EventEmitter } from 'events';
import { Logger } from './logger';
import { Repository } from './db/repository';
import { TestController } from './controller/check';

export class Server extends BaseServer {
    private readonly appConfig: ConfigConfig;

    constructor(config: ConfigConfig) {
        super();

        this.appConfig = getConfig();
        this.app.locals.repo = new Repository(this.appConfig.dbUrl);

        this.app.locals.appConfig = this.appConfig;
        this.app.locals.eventBus = new EventEmitter();

        this.app.use(Logger.express(config));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.set('trust proxy', true);
        this.app.disable('x-powered-by');
        this.app.set('port', this.appConfig.port);

        super.addControllers([
            new HealthController(),
            new TestController(this.app),
        ]);
    }

    public start(): Promise<any> {
        const server = this.app.listen(this.appConfig.port);
        const scopedApp = this.app;
        const scopedEventBus = this.app.locals.eventBus;

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
