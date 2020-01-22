import { Repository } from './repository';
import { ConfigValue } from '../model';

export class ConfigStore extends Repository {
    constructor(db: any) {
        super(db);
    }
    
    async get(ns: string, key: string): Promise<ConfigValue> {
        return this.knex('config_value')
            .where({namespace: ns, key: key})
            .select('*')
            .first()
            .then(ConfigValue.fromJson);
    }
    
    async insert(value: ConfigValue): Promise<number> {
        const json: any = value.toJson();
        delete json.id;

        return this.knex('config_value')
            .returning('id')
            .insert(json)
            .then(num => num[0]);
    }

    async update(value: ConfigValue): Promise<true> {
        return new Promise<true>((resolve, reject) => {
            try {
                this.knex('config_value')
                    .where({
                        id: value.id,
                        namespace: value.namespace,
                        key: value.key,
                        version: value.version
                    }).update(
                        Object.assign(value.toJson(), {version: value.version + 1}));

                resolve(true);
            } catch(e) {
                console.log(e);
                reject(e);
            }
        })
    }

    async clear(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.knex('config_value').del()
                .then((affected: number) => resolve(affected))
                .catch((reason: any) => reject(reason));
        });
    }
}