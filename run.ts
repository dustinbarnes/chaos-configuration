import { runServer } from './src/server';

runServer()
    .catch((e: Error) => {
        console.log(e);
        process.exit(2)
    });
