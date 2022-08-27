
# Backend application for Cloudlet service

This application is an integral part of service ,,Cloudlet" Program handle connections between database and front-end, validate incoming data, sending reminding, registration, and password reset emails. Also takes care for logging in procedures and uploading/downloading/store files. All code is in Nest.js framework.

## Program parts

### User controller

This part of application takes care about all procedures related with user. Using this endpoints you can login or logout, change or reset password, make new account and activate it.

### Files controller

Using this part you can easily upload or download a files or photos

### Notes controller

Adding notes, saves reminders in calendar, edit/removing notes

### CRON

Cleaning database from inactivated users, sending reminding emails

## Frontend

This app is inseparably part of Cloudlet service. Front-end you can find in my repository:

https://github.com/darone90/cloudlet_front

##  Technology

Cloudlet backend was made with Nest.js framework and TypeScript

Additional packages:

- mysql2

- bcrypt

- nodemailer

- typeorm

Application use mySql database MariaDB

## How to start ?

### Package installing

After cloning repository you need to install all required packages. For example using npm:

-npm install

### Adjust safety parameters

Before start please fill in the fields in userPass.config.ts:

- password: Password for hashing users password (string of characters),

- algorithm: algorithm for coding password (for example aes-192-cbc),

- iterations: number of iterations in hashing,

- saltLength: length of salt for hashing,

- linkLength: length of activation code in activation link,

- activationPath: direct address to a backend server,

### Adjust mail client data

- mailCli: your mail cli,

- mailPass: password for mail cli,

- mailService: name of service of your mail cli,

### Adjusting space for each user

- freeSpaceForFoto: how many bites you give for each user files in server,

- freeSpaceForFiles: how many bites you give for each user photos in server,

### Adjusting database connection

- type: type od database (for example mySql),

- host: name of the host of database,

- port: port of database,

- username: username for your database,

- password: password for your database,

- database: name of the database,

### Adding frontend address

- frontEndAddress: address of frontend app,

### Install Nest.js

to start developer server or to make build version you need nest.js installed globally

### Start develop server

Use commend:

- nest start --watch // with watch mode

### Make production version

Use command:

- nest build

## Very important!

If you want to use develop server (nest start or npm run start:dev) in ormconfig you need to set entities: ['dist/**/**.entity{.ts,.js}'],

using production version, before build set entities: ['**/**.entity{.ts,.js}'],

## Contact

If you want to reach me use my email: pileckidariusz90@gmail.com

## Copyrights

All data in this repository are free to use for everyone
