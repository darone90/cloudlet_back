import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Inject } from '@nestjs/common';
import { newUserDataSet } from 'src/users/dto/users.dto';
import { databaseUserForm } from 'src/types/user.type';

import { passConfig } from 'userpass.config';
import { hasher } from 'src/utils/crypto';
import { randomSigns } from 'src/utils/random-signs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NewUserDataConfirmAndHash implements PipeTransform<newUserDataSet, Promise<databaseUserForm>> {

    constructor(
        @Inject(UsersService) private userService: UsersService,
    ) {

    }

    async transform(data: newUserDataSet, metadata: ArgumentMetadata): Promise<databaseUserForm> {

        if (!data.email || !data.login || !data.password || !data.confirm) {
            throw new Error('Incoming data are not complet.');
        }

        if (data.email.length > 60 || data.email.length < 5 || data.login.length > 40 || data.login.length < 3 || data.password.length > 30 || data.password.length < 6) {
            throw new Error('New User dataset validation error( some data have wrong length)');
        }

        if (data.password !== data.confirm) {
            throw new Error('Password confirm is different than password');
        }

        const userNameValid = await this.userService.checkValidLogin(data.login);

        if (!userNameValid) {
            throw new Error('User with used login already existed, use different login name');
        }

        const link = passConfig.path + randomSigns(passConfig.linkLength);
        const salt = randomSigns(passConfig.saltLength);
        const hashedPassword = await hasher(data.password, salt);

        return {
            email: data.email,
            login: data.login,
            password: hashedPassword.coded,
            activationLink: link,
            salt: salt,
            iv: hashedPassword.iv,
        }
    }
}