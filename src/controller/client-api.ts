import { OK, SERVICE_UNAVAILABLE, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Response, Application } from 'express';
import { RequestExt, Logger } from '../logger';
import { Repository } from '../db/repository';
import { Resolver, DefaultResolver } from '../resolver';

@Controller('api/client')
export class ClientController {
    private resolver: Resolver;

    constructor(private app: Application) {
        this.resolver = new DefaultResolver();
    }

    @Get(':namespace/:key')
    public async get(req: RequestExt, res: Response) {
        try {
            const namespace: string = req.params.namespace;
            const key: string = req.params.key;
        
            const query = JSON.parse(req.query.query || '{}');
            const queryToMap = new Map(Object.entries(query));

            Logger.getInstance().error(query);
            Logger.getInstance().error(queryToMap);


            const repo: Repository = this.app.locals.repo;

            const result = await repo.get(namespace, key); 

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
            return res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD' });
        }
    }
}
