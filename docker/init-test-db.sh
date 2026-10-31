#!/bin/sh
# Runs once, when the Postgres volume is first created.
# Creates a separate database for automated tests: <DB_NAME>_test.
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
CREATE DATABASE "${POSTGRES_DB}_test" OWNER "$POSTGRES_USER";
EOSQL
