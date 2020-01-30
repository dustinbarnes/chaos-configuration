import { ConfigStore } from "../../src/db/config-store";
import { ConfigValue } from "../../src/model";
import * as Knex from 'knex';
import { getConfig } from "../../src/config";
import dbState from "./test-db-value";

async function resetDatabase(store: ConfigStore) {
    await store.clear();
}

async function setupDatabase(store: ConfigStore) {
    const unresolvedPromises = await createConfigValues(store);
    return Promise.all(unresolvedPromises);
}

async function createConfigValues(store: ConfigStore): Promise<Promise<number>[]> {
    return dbState.configValues.map(item => {
        return store.insert(ConfigValue.fromJson(item));
    });
}

export async function testDbInit(): Promise<true> {
    const config = getConfig();
    // const db = Knex(config.db);    

    // await db.migrate.latest();

    const store = new ConfigStore(config.db);

    await resetDatabase(store);
    await setupDatabase(store);

    return true;
}