import { Injectable } from '@nestjs/common';

import { Note } from './dto/notes.dto';
import { UserResponse } from 'src/types/user.type';
import { shortNote } from 'src/types/notes.type';

import { NotesEntity } from './notes.entity';
import { UserEntity } from 'src/users/users.entity';

@Injectable()
export class NotesService {

    async addNotes(note: Note, id: string): Promise<UserResponse> {

        const record = new NotesEntity();

        record.title = note.title;
        record.description = note.description;
        if (note.startDate) record.startDate = note.startDate;
        if (note.endDate) record.endDate = note.endDate;
        record.delete = note.delete;
        if (note.email) {
            record.email = note.email
            // tu dodać CRON
        };
        record.create = note.create;

        const user = await UserEntity.findOne({
            where: {
                id,
            }
        })
        record.user = user

        await record.save();

        const response = {
            status: true,
            info: 'ok'
        }

        return response

    }

    async getShortNotes(id: string): Promise<shortNote[]> {

        const user = await UserEntity.findOne({
            where: {
                id,
            },
            relations: {
                notes: true
            }
        })

        const data = user.notes.map(note => ({
            id: note.id,
            title: note.title,
            createdAt: note.create,
            validTo: note.endDate,
            eventStart: note.startDate,
        }))

        return data
    }

    async getOne(id: string): Promise<Note> {

        const result = await NotesEntity.findOne({
            where: {
                id,
            }
        })

        return result;
    }

    async deleteOne(id: string): Promise<UserResponse> {

        const result = await NotesEntity.findOne({
            where: {
                id,
            }
        })

        await result.remove();

        const response = {
            status: true,
            info: 'ok'
        }

        return response
    }
}
