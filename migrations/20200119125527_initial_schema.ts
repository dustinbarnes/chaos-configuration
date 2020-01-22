import * as Knex from "knex";

exports.up = (knex: Knex): Promise<any> => {
    return knex.schema.createTable('config_value', (table: Knex.CreateTableBuilder) => {
        table.increments('id');
        table.timestamps(true, true);
        table.string('namespace');
        table.string('key');
        table.jsonb('config_value_json');   
        table.integer('version');
        table.unique(['namespace', 'key']);
    }).then();
}

exports.down = (knex: Knex): Promise<any> => {
    return knex.schema.dropTable('config_value').then();    
}
