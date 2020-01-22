// Update with your config settings.

module.exports = {

  development: {
    client: "pg",
    connection: {
      database: "chaosconfig_dev",
      user: "chaosconfig_dev",
      password: "chaosconfig-dev-password",
      host: "localhost"
    },
    pool: {
      min: 2,
      max: 4
    },
    migrations: {
      tableName: "knex_migrations",
      extensions: ['.ts']
    },
    useNullAsDefault: true,
  },

  test: {
    client: "postgresql",
    connection: {
      database: "chaosconfig_test",
      user: "chaosconfig_test",
      password: "chaosconfig-test-password",
      host: "localhost"
    },
    pool: {
      min: 2,
      max: 4
    },
    migrations: {
      tableName: "knex_migrations"
    },
    useNullAsDefault: true,
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "chaosconfig_stg",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: {
      database: "chaosconfig",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    useNullAsDefault: true,
  }

};
