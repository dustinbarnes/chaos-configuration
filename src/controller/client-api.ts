import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Response, Application } from 'express';
import { RequestExt, Logger } from '../logger';
import { ConfigStore } from '../db/config-store';
import { Resolver, DefaultResolver } from '../resolver';

export class ClientController {
    private resolver: Resolver;

    constructor(private app: Application) {
        this.resolver = new DefaultResolver();
    }

    public get = async (req: RequestExt, res: Response) => {
        try {
            const namespace: string = req.params.namespace;
            const key: string = req.params.key;
        
            const query = JSON.parse(req.query.query || '{}');
            const queryToMap = new Map<string, string>(Object.entries(query));

            Logger.getInstance().error(query);
            Logger.getInstance().error(queryToMap);

            const store: ConfigStore = this.app.locals.ConfigStore;

            const result = await store.get(namespace, key); 

            Logger.getInstance().info(`Result is ${result}`);

            // In the ultimate version, i want the client libs to be executing this portion
            // This keeps the server extremely lightweight for GET requests. However, 
            // to expedite development progress, it's happening here. 
            const theValue = this.resolver.resolve(result.value, queryToMap);

            if (theValue) {
                return res.status(OK).json(theValue);
            } else {
                return res.status(NOT_FOUND).json('404 Not Found');
            }
        } catch (e) {
            req.log.error('Error', e);
            Logger.getInstance().error(`Other logger`, e);
            return res.status(INTERNAL_SERVER_ERROR).json({ health: 'BAD' });
        }
    }

    public getAll = async (req: RequestExt, res: Response) => {
        try {
            const namespace: string = req.params.namespace;
        
            const query = JSON.parse(req.query.query || '{}');
            const queryToMap = new Map<string, string>(Object.entries(query));

            Logger.getInstance().error(query);
            Logger.getInstance().error(queryToMap);

            const store: ConfigStore = this.app.locals.ConfigStore;

            const result = await store.list(namespace);

            const results = {}
            for (const configValue of result) {
                const theValue = this.resolver.resolve(configValue.value, queryToMap);
                if (theValue) {
                    results[configValue.key] = theValue;
                }    
            }

            if (results) {
                return res.status(OK).json(results);
            } else {
                return res.status(NOT_FOUND).json('404 Not Found');
            }
        } catch (e) {
            req.log.error('Error', e);
            Logger.getInstance().error(`Other logger`, e);
            return res.status(INTERNAL_SERVER_ERROR).json({ health: 'BAD' });
        }
    }
}
