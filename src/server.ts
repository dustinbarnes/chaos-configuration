import { createApp } from './app';
import * as e from 'express';

// tslint:disable: no-backbone-get-set-outside-model

export async function runServer(): Promise<e.Application> {
    const app: e.Application = await createApp(null);
    const server = app.listen(app.get('port'));

    return new Promise((resolve, reject) => {
        server.on('listening', () => {
            console.log(`  App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
            console.log('  Press CTRL-C to stop\n');
            resolve(app);
        })
        server.on('error', reject);
    })
}
