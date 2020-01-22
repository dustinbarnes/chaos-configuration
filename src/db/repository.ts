import * as Knex from 'knex';

export class Repository {
    protected readonly knex: Knex;

    constructor(db: any) {
        this.knex = Knex(db);
    }

    public get db(): Knex {
        return this.knex;
    }
}
