import { Injectable } from '@nestjs/common';
import { Cron } from "@nestjs/schedule";
import { UserEntity } from 'src/users/users.entity';
import { NotesEntity } from 'src/notes/notes.entity';
import { sendEventReminder } from 'src/utils/mail-sender';

@Injectable()
export class CronService {

    @Cron('0 6 * * *')
    async sendRemaidingMail() {
        const actualDate = ((new Date()).toISOString()).slice(0, 10);
        const result = await NotesEntity.find({
            where: {
                email: actualDate
            },
            relations: {
                user: true
            }
        })

        if (result.length > 0) {
            result.forEach(async (note) => {
                await sendEventReminder(note.user.email, note.user.login, note.title);
            })
            console.log(`Zostało wysałne ${result.length} maili przypominających`);
            return;
        }

        console.log('brak maili do wysłania na dziś')

    }

    @Cron('59 23 * * *')
    async removeOldNotes() {
        const actualDate = ((new Date()).toISOString()).slice(0, 10);
        const result = await NotesEntity.find({
            where: {
                delete: true,
                endDate: actualDate
            }
        })

        if (result.length > 0) {
            console.log('Usunięto: ', result.length, ' przedawnionych notatek')
            result.forEach(async (note) => await note.remove())
            return
        }
        console.log('brak przedawnionych notatek')
    }

    @Cron('0 2 * * *')
    async removeNoActivatedUser() {
        const result = await UserEntity.find({
            where: {
                active: false
            }
        })
        if (result.length > 0) {
            console.log('usunięto przez brak aktyacji: ', result.length, 'uzytkowników')
            result.forEach(async (user) => await user.remove())
            return;
        }
        console.log('Brak nieaktywowanych użytkoników')
    }
}
