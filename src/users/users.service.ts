import { Injectable } from '@nestjs/common';
import { databaseUserForm, Login } from 'src/types/user.type';
import { UserEntity } from './users.entity';
import { sendActivationLink } from 'src/utils/mail-sender';
import { passConfig } from 'userpass.config';
import { LoginData } from './dto/users.dto';
import { comparer } from 'src/utils/crypto';

@Injectable()
export class UsersService {

    async addUser(data: databaseUserForm): Promise<string> {
        const user = new UserEntity();
        user.email = data.email;
        user.login = data.login;
        user.password = data.password;
        user.iv = data.iv;
        user.salt = data.salt;
        user.activationLink = data.activationLink;
        try {
            await user.save();
            await sendActivationLink(user.activationLink, user.id, user.email);
            return user.id
        } catch (err) {
            console.log(err)
        }
    }

    async checkValidLogin(login: string): Promise<boolean> {
        const result = await UserEntity.find({
            where: {
                login,
            }
        })

        if (result.length < 1) {
            return true
        } else {
            return false
        }
    }

    async userActivation(code: string): Promise<boolean> {
        const result = await UserEntity.findOne({
            where: {
                activationLink: passConfig.path + code
            }
        })
        if (!result) {
            return false;
        }
        result.active = true;
        result.activationLink = null;
        await result.save();
        return true;
    }

    async userLogin(obj: LoginData): Promise<Login> {
        const result = await UserEntity.findOne({
            where: {
                login: obj.login
            }
        })
        if (!result) {
            return {
                login: false,
                token: null,
                user: null,
            }
        } else {

            const isPasswordCorrect = await comparer(obj.password, result.password, result.iv, result.salt);
            if (!isPasswordCorrect || !result.active) {
                return {
                    login: false,
                    token: null,
                    user: null,
                }
            } else {
                return {
                    login: true,
                    token: result.id,
                    user: result.login,
                }
            }
        }
    }

}
