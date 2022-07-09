import { Injectable } from '@nestjs/common';
import { AfterCheckFile, SendingFormat, FreeSpace } from 'src/types/files.type';
import { UserResponse } from 'src/types/user.type';
import { FileEntity } from './files.entity';
import { UserEntity } from 'src/users/users.entity';
import * as path from 'path';
import { unlink } from 'fs/promises';
import { destionation } from 'src/multer/multer.storage';
import { dataFilter } from 'src/multer/multer.storage';
import { passConfig } from 'userpass.config';

@Injectable()
export class FilesService {


    async sendFilesData(token: string): Promise<SendingFormat> {
        const result = await UserEntity.findOne({
            where: {
                id: token
            },
            relations: {
                files: true
            }
        })

        const data = result.files.map(res => dataFilter(res));

        const files = data.filter(file => file.type === 'file');
        const fotos = data.filter(foto => foto.type === 'foto');

        return {
            files,
            fotos
        }
    }
    async freeSpacevalidation(id: string, type: string): Promise<boolean> {
        const usedSpace = await this.getFreeSpace(id)
        let freeSpace: number
        if (type === 'foto') {
            freeSpace = 100 - usedSpace.fotoSpace
        }
        if (type === 'file') {
            freeSpace = 100 - usedSpace.fileSpace
        }

        const validator = freeSpace > 0 ? true : false

        return validator
    }

    async addFileToDatabase(file: AfterCheckFile, type: string, token: string): Promise<UserResponse> {


        const user = await UserEntity.findOne({
            where: {
                id: token
            }
        })

        const validator = await this.freeSpacevalidation(token, type);

        if (!validator) {

            await this.deleteFileFromStorage(file.filename)

            return {
                status: false,
                info: 'Brak wolnego miejsca na dysku'
            }
        }

        const newFile = new FileEntity();
        newFile.name = file.filename;
        newFile.orginalName = file.originalname;
        newFile.type = type;
        newFile.size = file.size;
        newFile.extension = file.mimetype;
        newFile.user = user;

        await newFile.save()

        return {
            status: true,
            info: newFile.id
        }
    }

    async deleteFileFromStorage(filename: string): Promise<boolean> {
        try {
            await unlink(path.join(destionation(), filename))
            return true;
        } catch (err) {
            console.log(err)
            return false
        }
    }


    async deleteFileFromDatabaseAndStorage(id: string): Promise<UserResponse> {

        const result = await FileEntity.findOne({
            where: {
                id
            }
        })

        if (!result) {
            return {
                status: false,
                info: 'plik nie istnieje'
            }
        }

        await unlink(path.join(destionation(), result.name))
        await result.remove();

        return {
            status: true,
            info: 'ok'
        }

    }

    async getFreeSpace(token: string): Promise<FreeSpace> {
        const result = await UserEntity.findOne({
            where: {
                id: token
            },
            relations: {
                files: true
            }
        })

        const data = result.files.map(res => dataFilter(res));

        const files = (data.filter(file => file.type === 'file')).map(file => Number(file.size));
        const fotos = (data.filter(foto => foto.type === 'foto')).map(foto => Number(foto.size));

        let valueFile: number;
        if (files.length > 0) {
            valueFile = Math.round((files.reduce((prev, curr) => prev + curr)) / (passConfig.freeSpaceForFiles / 100));
        } else { valueFile = 0 }
        let valueFoto: number;
        if (fotos.length > 0) {
            valueFoto = Math.round((fotos.reduce((prev, curr) => prev + curr)) / (passConfig.freeSpaceForFoto / 100));
        } else { valueFoto = 0 }

        const response = {
            fileSpace: valueFile,
            fotoSpace: valueFoto
        }

        return response
    }

    async sendFileToClient(res: any, id: string) {

        const result = await FileEntity.findOne({
            where: {
                id,
            }
        })

        if (!result) return

        res.sendFile(
            result.name,
            {
                root: destionation()
            }
        )

    }
}
