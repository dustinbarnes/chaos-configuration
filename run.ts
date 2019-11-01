import { Server } from './src/server';

const server = new Server(null);
server
    .start()
    .then(instance => {
        const address = instance.server.address();
        console.log(
            `Server started on http://${address.address}:${address.port}`
        );
    })
    .catch(console.error);
