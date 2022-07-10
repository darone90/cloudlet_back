BACKEND APPLICATION FOR CLOUDLET SERIVICE;

Befor start please fill in the fields in userPass.config.ts:

hashing part:

password: Password for hashing users password (string of characters),
algorithm: algorithm for coding password (for example aes-192-cbc),
iterations: number of iterations in hashing,
saltLength: length of salt for hashing,

user activation part:

linkLength: length of activation code in activation link,
activationPath: direct adress to a backend server,

mail client data:

mailCli: your mail cli,
mailPass: password for mail cli,
mailService: name of servis of your mail cli,

space for user in cloud:

freeSpaceForFoto: how many bites you give for each user files in server,
freeSpaceForFiles: how many bites you give for each user fotos in server,

frontend address:

frontEndAddress: adress of frontend app,

next you need to fill database params:

    type: type od database (for example mySql),
    host: name of the host of database,
    port: port of database,
    username: username for your database,
    password: password for your database,
    database: name of the database,

VERY IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

If you want to use develeoper server (nest start or npm run start:dev) in ormconfig you need to set entities: ['dist/**/**.entity{.ts,.js}'],
using prod versio, before build set entities: ['**/**.entity{.ts,.js}'],

------------------------------------------------------------------------------------->


After fill in userpass.config.ts you can run the app

App use CRON and email services to contact with user.

All users password datas are coded and hashed.

All path for user are under authentication guards.

With questions and problems: please contac me: pileckidariusz90@gmail.com



