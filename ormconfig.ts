export const databaseConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'cloudlet',
    entities: ['dist/**/**.entity{.ts,.js}'],
    bigNumberStrings: false,
    logging: true,
    synchronize: true,
    migrations: ['dist/migration/*.js'],
    cli: {
        migrationsDir: 'mir'
    }
}