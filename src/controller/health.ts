import { OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Controller, Get } from '@overnightjs/core';
import { Response } from 'express';
import { RequestExt } from '../logger';

@Controller('health')
export class HealthController {

    @Get('')
    public get(req: RequestExt, res: Response) {
        try {
            // await this.db.select(1).from('features');
            // todo: do something.
            res.status(OK).json({ health: 'GOOD' });
        } catch (e) {
            // @ts-ignore
            req.log.error('Error during health check', e);
            res.status(SERVICE_UNAVAILABLE).json({ health: 'BAD' });
        }
    }
}
