#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER chaosconfig;
    CREATE DATABASE chaosconfig;
    ALTER USER chaosconfig WITH ENCRYPTED PASSWORD 'chaosconfig-password';
    GRANT ALL PRIVILEGES ON DATABASE chaosconfig TO chaosconfig;

    CREATE USER chaosconfig_dev;
    CREATE DATABASE chaosconfig_dev;
    ALTER USER chaosconfig_dev WITH ENCRYPTED PASSWORD 'chaosconfig-dev-password';
    GRANT ALL PRIVILEGES ON DATABASE chaosconfig_dev TO chaosconfig_dev;

    CREATE USER chaosconfig_test;
    CREATE DATABASE chaosconfig_test;
    ALTER USER chaosconfig_test WITH ENCRYPTED PASSWORD 'chaosconfig-test-password';
    GRANT ALL PRIVILEGES ON DATABASE chaosconfig_test TO chaosconfig_test;

EOSQL
