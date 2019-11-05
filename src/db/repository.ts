import * as Keyv from 'keyv';
import { ConfigValue } from '../models';

export class Repository {
    private readonly keyv: Keyv;

    constructor(dbUrl: string) {
        this.keyv = new Keyv(dbUrl);
        this.keyv.on('error', (err: Error) => console.log('Connection Error', err));
    }
    
    async get(ns: string, key: string): Promise<ConfigValue> {
        return this.keyv.get(this.toKey(ns, key));
    }
    
    async set(ns: string, key: string, value: ConfigValue): Promise<true> {
        return this.keyv.set(this.toKey(ns, key), value);
    }

    private toKey(ns: string, key: string): string {
        return `${ns}.${key}`;
    }
}
