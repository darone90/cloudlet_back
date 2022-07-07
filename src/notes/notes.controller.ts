import { Body, Controller, Inject, Post, Headers, UseGuards, Get, Param, Delete, UsePipes, UseFilters } from '@nestjs/common';
import { AuthGuard } from 'src/guards/authentication.guard';
import { NotesService } from './notes.service';
import { NewNoteDataValidation } from 'src/pipes/add-note-validation.pipe';
import { DataChangeExceptionFilter } from 'src/filters/changeuser.filter';
import { Note } from './dto/notes.dto';

@Controller('notes')
export class NotesController {
    constructor(
        @Inject(NotesService) private notesService: NotesService
    ) { }

    @Get('/')
    @UseGuards(AuthGuard)
    async getShortNotes(
        @Headers() headers: any
    ) {
        try {
            const userId = headers.token as string;
            const response = await this.notesService.getShortNotes(userId);

            return response
        } catch (err) {
            console.log(err);
        }
    }

    @Get('/get/:id')
    async getOneNote(
        @Param('id') id: string,
    ) {
        try {
            const response = await this.notesService.getOne(id);
            return response;

        } catch (err) {
            console.log(err)
        }
    }

    @Post('/add')
    @UsePipes(NewNoteDataValidation)
    @UseFilters(new DataChangeExceptionFilter())
    @UseGuards(AuthGuard)
    async addNote(
        @Body() newNote: Note,
        @Headers() headers: any
    ) {
        try {
            const userId = headers.token as string;
            const response = await this.notesService.addNotes(newNote, userId)

            return response;

        } catch (err) {
            console.log(err);
            return {
                status: false,
                info: 'Problem podczas zapisu notatki...'
            }
        }
    }

    @Delete('/delete/:id')
    async deleteNote(
        @Param('id') id: string,
    ) {
        try {
            const response = await this.notesService.deleteOne(id);
            return response;

        } catch (err) {
            console.log(err);
            return {
                status: false,
                info: 'Błąd podczas usuwania notatki...'
            }
        }
    }


}
