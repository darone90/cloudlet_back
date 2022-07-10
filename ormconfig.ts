import { database } from "userpass.config"

export const databaseConfig = {
    type: database.type,
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    entities: ['dist/**/**.entity{.ts,.js}'],
    bigNumberStrings: false,
    logging: false,
    synchronize: false,
    migrations: ['dist/migration/*.js'],
}