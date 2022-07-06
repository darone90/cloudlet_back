import { PipeTransform, Injectable, ArgumentMetadata, NotAcceptableException } from '@nestjs/common';
import { UserChange } from 'src/users/dto/users.dto';
import { UserEntity } from 'src/users/users.entity';


@Injectable()
export class UserDataChangeValidationPipe implements PipeTransform<UserChange, Promise<UserChange>> {


    async transform(data: UserChange, metadata: ArgumentMetadata): Promise<UserChange> {

        if (data.change !== data.confirm) {
            throw new NotAcceptableException(Error, 'Potwierdzenie danych jest inne niż wprowadzone dane');
        }

        if (data.type !== 'email' && data.type !== 'login' && data.type !== 'password') {
            throw new NotAcceptableException(Error, 'Zabroniony typ danych');
        }

        if (data.type === 'email') {
            if (data.change.length > 60 || data.change.length < 5) {
                throw new NotAcceptableException(Error, 'Niepoprawna długość adresu email');
            }
        }

        if (data.type === 'login') {
            if (data.change.length > 40 || data.change.length < 3) {
                throw new NotAcceptableException(Error, 'Niepoprawna długość loginu');
            }
            const validLogin = await UserEntity.find({
                where: {
                    login: data.change
                }
            })

            if (validLogin.length > 0) {
                throw new NotAcceptableException(Error, 'Login jest zajęty, wybierz inny');
            }
        }

        if (data.type === 'password') {
            if (data.change.length > 30 || data.change.length < 8) {
                throw new NotAcceptableException(Error, 'Niepoprawna długość hasła');
            }
        }

        return data
    }
}