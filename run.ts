import { runServer } from './src/server';

console.log("about to run server");
runServer()
    .then(() => console.log('Service ready'))
    .catch((e: Error) => {
        console.log("i gots an error");
        console.log(e);
        process.exit(2)
    });
