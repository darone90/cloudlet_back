import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Headers, Inject, Body, Get, Delete, Param, UsePipes, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { destionation } from 'src/multer/multer.storage';
import { UploadeFileMulter } from 'src/types/files.type';
import { AuthGuard } from 'src/guards/authentication.guard';
import { FilesService } from './files.service';
import { fileBody } from 'src/types/files.type';



@Controller('files')
export class FilesController {

    constructor(
        @Inject(FilesService) private fileService: FilesService
    ) { }


    @Get('/')
    @UseGuards(AuthGuard)
    async sendFilesData(
        @Headers() headers: any,
    ) {
        try {
            const response = await this.fileService.sendFilesData(headers.token as string);
            return response;
        } catch (err) {
            console.log(err)
        }
    }

    @Get('/free')
    @UseGuards(AuthGuard)
    async getFreeSpace(
        @Headers() headers: any
    ) {
        try {
            const response = await this.fileService.getFreeSpace(headers.token);
            return response
        } catch (err) {
            console.log(err)
        }
    }

    @Get('/file/:id')
    @UseGuards(AuthGuard)
    async sendFile(
        @Param('id') id: string,
        @Res() res: any
    ) {
        try {
            await this.fileService.sendFileToClient(res, id);
        } catch (err) {
            console.log(err)
        }

    }

    @Post('/')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'file', maxCount: 1,
            }
        ], {
            dest: destionation(),
        })
    )
    async uploadFile(
        @UploadedFiles() incomeFile: UploadeFileMulter,
        @Body() body: fileBody,
        @Headers() headers: any
    ) {
        const fileData = (incomeFile && incomeFile.file) ? incomeFile.file[0] : null;
        if (fileData) {
            try {
                const response = await this.fileService.addFileToDatabase(fileData, body.type, headers.token);
                return response;

            } catch (err) {
                console.log(err)
                await this.fileService.deleteFileFromStorage(fileData.filename)
                return {
                    status: false,
                    info: 'Błąd podczas zapisu pliku...'
                }
            }
        } else {
            return {
                status: false,
                info: 'brak pliku...'
            }
        }

    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard)
    async deleteFile(
        @Param('id') id: string
    ) {
        try {
            const response = await this.fileService.deleteFileFromDatabaseAndStorage(id);
            return response
        } catch (err) {
            console.log(err)
            return {
                status: false,
                info: 'Błąd podczas usuwania pliku.'
            }
        }
    }
}
