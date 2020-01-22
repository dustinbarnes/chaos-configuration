import { OK, SERVICE_UNAVAILABLE, NOT_FOUND } from 'http-status-codes';
import { Response, Application } from 'express';
import { RequestExt } from '../logger';
import { ConfigStore } from '../db/config-store';
import { loadData } from '../util/data-loader';

export class AdminController {
    constructor(private app: Application) {}

    public get = async (req: RequestExt, res: Response) => {
        try {
            const store: ConfigStore = this.app.locals.ConfigStore;

            const namespace: string = req.params.namespace;
            const key: string = req.params.key;

            const result = await store.get(namespace, key); 
            if (result) {
                return res.status(OK).json(result);
            } else {
                return res.status(NOT_FOUND).json('404 Not Found');
            }
        } catch (e) {
            req.log.error('Error', e);
            return res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD' });
        }
    }

    public populateTestData = async (req: RequestExt, res: Response) => {
        try {
            loadData();
            return res.status(OK).json({done: true});
        } catch (e) {
            console.log(e);
            return res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD' });
        }
    }
}