import { ArgumentMetadata, Injectable, PipeTransform, NotAcceptableException } from "@nestjs/common";
import { Note } from "src/notes/dto/notes.dto";


@Injectable()
export class NewNoteDataValidation implements PipeTransform<Note, Note> {

    transform(data: Note, metadata: ArgumentMetadata): Note {

        if (data.title.length < 1 || data.description.length < 1) {
            throw new NotAcceptableException(Error, 'Nie podano tytułu lubopisu ( są wymagane )')
        };

        if (data.title.length > 50) {
            throw new NotAcceptableException(Error, 'Za długi tytuł ( max 50 znaków )')
        };

        if (data.description.length > 5000) {
            throw new NotAcceptableException(Error, 'Za długi opis ( max 5000 znaków )')
        };

        if (data.delete === true && data.endDate === '') {
            throw new NotAcceptableException(Error, 'Nie można ustawić autousuwania bez podania daty zakończenia ewentu')
        };

        return data;
    }
}