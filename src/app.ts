import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as expressJwt from 'express-jwt';
import * as swaggerUI from 'swagger-ui-express';
// import * as swaggerDocument from '../swagger.json';
// import { AuthRouter, SwaggerAPIRouter, UserRouter } from './routes';
import { getConfig } from './config';
import { Logger } from './logger';
import { EventEmitter } from 'events';
import { ConfigStore } from './db/config-store';
import { buildRoutes } from './routes';

export async function createApp(configStore: ConfigStore): Promise<express.Application> {
    // Create Express server
    const app: express.Application = express();

    // Build our config
    const config = getConfig();

    // Use Helmet (https://helmetjs.github.io/) for basic api security
    app.use(helmet());

    // Some fun app-type-things
    app.locals.ConfigStore = configStore || new ConfigStore(config.db);
    app.locals.appConfig = config;
    app.locals.eventBus = new EventEmitter();

    // App Config
    // tslint:disable-next-line: no-backbone-get-set-outside-model
    app.set('port', config.port);
    app.use(compression());
    app.use(Logger.express(config));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    //app.use(expressValidator())

    // app.use(expressJwt({
    //     secret: config.jwtSecret,
    //     requestProperty: 'auth',
    //     getToken: (req: express.Request) => {
    //         const tokenHeader = req.headers.Authorization || req.headers.authorization;
    //         if (tokenHeader && (tokenHeader as string).split(' ')[0] === 'Bearer') {
    //             return (tokenHeader as string).split(' ')[1];
    //         }

    //         return null;
    //     }
    // }).unless({path: [/\/api-docs\//g, {url: '/', method: 'OPTIONS'}, /\/auth\//g]}));

    // // Send 401 response if we've gotten an unauthorized error. 
    // app.use((err: Error, req: express.Request, res: express.Response) => {
    //     if (err.name === 'UnauthorizedError') {
    //         res.status(401).send({
    //             msg: 'Invalid or no token supplied',
    //             code: 401
    //         });
    //     }
    // });

    // Build our routes!
    const routes = await buildRoutes(app);

    // Mount our health endpoint
    app.use('/health', routes.healthRouter);

    // Admin API
    app.use('/api/admin', routes.adminRouter);

    // Client api
    app.use('/api/client', routes.clientRouter);

    // General catch-all for misc requests
    app.use((req: express.Request, resp: express.Response) => {
        resp.status(404).send({
            msg: 'Not Found!'
        });
    });

    //app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
    //app.use('/api/v1', SwaggerAPIRouter);

    return app;
}