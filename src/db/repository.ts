import * as Keyv from 'keyv';
import { ConfigValue } from '../models';
import { Logger } from '../logger';
import { inspect } from 'util';

export class Repository {
    private readonly keyv: Keyv;

    constructor(dbUrl: string) {
        this.keyv = new Keyv(dbUrl);
        this.keyv.on('error', (err: Error) => console.log('Connection Error', err));
    }
    
    async get(ns: string, key: string): Promise<ConfigValue> {
        const value = await this.keyv.get(this.toKey(ns, key));
        const real = ConfigValue.fromJson(value);

        Logger.getInstance().warn(`repo::get ${ns}, ${key}, ${inspect(real, false, 12)}`);

        return real;
    }
    
    async set(ns: string, key: string, value: ConfigValue): Promise<true> {
        Logger.getInstance().warn(`repo::set ${ns}, ${key}, ${inspect(value.toJson(), false, 12)}`);

        return this.keyv.set(this.toKey(ns, key), value.toJson());
    }

    private toKey(ns: string, key: string): string {
        return `${ns}.${key}`;
    }
}
