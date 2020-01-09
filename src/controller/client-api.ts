import { OK, SERVICE_UNAVAILABLE, NOT_FOUND } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Response, Application } from 'express';
import { RequestExt } from '../logger';
import { Repository } from '../db/repository';

@Controller('api/client')
export class ClientController {
    constructor(private app: Application) {}

    @Get(':namespace/:key')
    public async get(req: RequestExt, res: Response) {
        
        try {
            const repo: Repository = this.app.locals.repo;

            const namespace: string = req.params.namespace;
            const key: string = req.params.key;

            const result = await repo.get(namespace, key); 
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
}
