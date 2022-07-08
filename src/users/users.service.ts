import { Injectable } from '@nestjs/common';
import { databaseUserForm, Login } from 'src/types/user.type';
import { UserEntity } from './users.entity';
import { sendActivationLink } from 'src/utils/mail-sender';
import { passConfig } from 'userpass.config';
import { LoginData, UserChange } from './dto/users.dto';
import { comparer, hasher } from 'src/utils/crypto';
import { UserResponse } from 'src/types/user.type';
import { randomSigns } from 'src/utils/random-signs';
import { PasswordResetData } from './dto/users.dto';
import { sendResetLink } from 'src/utils/mail-sender';

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

        await user.save();
        await sendActivationLink(user.activationLink, user.id, user.email);
        return user.id
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

    async resendActivation(login: string): Promise<boolean> {
        const result = await UserEntity.findOne({
            where: {
                login
            }
        })
        if (!result) return false;
        if (result.active) return false;

        await sendActivationLink(result.activationLink, result.id, result.email);
        return true;
    }

    async activatePasswordChanging(login: string): Promise<UserResponse> {
        const result = await UserEntity.findOne({
            where: {
                login
            }
        })

        if (!result || !result.active) return {
            status: false,
            info: 'Użytkownik o podanej nazwie nie istnieje lub nie został aktywowany'
        }

        result.activationLink = randomSigns(30);
        await sendResetLink(result.email, `http://localhost:3000/reset/${result.activationLink}`)
        await result.save();

        return {
            status: true,
            info: 'Link aktywacyjny został wysłany'
        }
    }

    async passwordChangingConfirmation(code: string): Promise<UserResponse> {
        const result = await UserEntity.findOne({
            where: {
                activationLink: code
            }
        })

        if (result) return {
            status: true,
            info: 'corecct user'
        }

        return {
            status: false,
            info: 'uncorrect user'
        }
    }

    async passwordReset(data: PasswordResetData): Promise<UserResponse> {
        const result = await UserEntity.findOne({
            where: {
                activationLink: data.code
            }
        })
        if (!result) return {
            status: false,
            info: 'taki użytkownik nie istnieje'
        }

        const hashedPassword = await hasher(data.password, result.salt);
        result.iv = hashedPassword.iv;
        result.password = hashedPassword.coded;
        result.activationLink = null;

        await result.save()

        return {
            status: true,
            info: 'hasło zostało zmienione'
        }
    }

    async userDataChange(data: UserChange, id: string): Promise<UserResponse> {

        const result = await UserEntity.findOne({
            where: {
                id
            }
        })

        const authentication = await comparer(data.password, result.password, result.iv, result.salt);

        if (authentication) {
            if (data.type === 'login') {
                result.login = data.change
            }

            if (data.type === 'email') {
                result.email = data.change
            }

            if (data.type === 'password') {
                const newPass = await hasher(data.change, result.salt);
                result.password = newPass.coded;
                result.iv = newPass.iv;
            }

            await result.save();
            return {
                status: true,
                info: 'data changed'
            }
        } else {
            return {
                status: false,
                info: 'niepoparwne hasło'
            }
        }
    }

    async deleteUser(id: string): Promise<void> {
        const result = await UserEntity.findOne({
            where: {
                id,
            },
            relations: {
                notes: true
            }

        })

        result.notes.forEach(async (note) => await note.remove())
        result.remove();
    }
}
