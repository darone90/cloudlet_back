
import { allImportantData, database as Alldatabase } from "actualData"

export const passConfig = {
    password: allImportantData.password,
    algorithm: allImportantData.algorithm,
    iterations: allImportantData.iterations,
    saltLength: allImportantData.saltLength,
    linkLength: allImportantData.linkLength,
    activationPath: allImportantData.activationPath,
    mailCli: allImportantData.mailCli,
    mailPass: allImportantData.mailPass,
    mailService: allImportantData.mailService,
    freeSpaceForFoto: allImportantData.freeSpaceForFoto,
    freeSpaceForFiles: allImportantData.freeSpaceForFiles,
    frontEndAddress: allImportantData.frontEndAddress
}

export const database = {
    type: Alldatabase.type,
    host: Alldatabase.host,
    port: Alldatabase.port,
    username: Alldatabase.username,
    password: Alldatabase.password,
    database: Alldatabase.database,
}