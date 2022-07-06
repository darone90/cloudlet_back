import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { PasswordResetData } from 'src/users/dto/users.dto';


@Injectable()
export class ResetPasswordVaildationPipe implements PipeTransform<PasswordResetData, PasswordResetData> {


    transform(data: PasswordResetData, metadata: ArgumentMetadata): PasswordResetData {

        if (data.password !== data.confirm) {
            throw new Error('Hasło i potwierdzenie hasła są różne');
        }

        if (data.password.length > 30 || data.password.length < 8) {
            throw new Error('Hasło ma niewłaściwą długość min 8 znaków max 30');
        }

        return data
    }
}