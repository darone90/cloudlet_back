import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, UseFilters, UseGuards, UsePipes, Headers } from '@nestjs/common';

import { UsersService } from './users.service';

import { NewUserDataConfirmAndHash } from 'src/pipes/add-user.pipe';
import { ResetPasswordVaildationPipe } from 'src/pipes/reset-validation.pipe';
import { UserDataChangeValidationPipe } from 'src/pipes/data-change-validation.pipe';

import { NewUserValidationFilter } from '../filters/adduser.filter';
import { DataChangeExceptionFilter } from 'src/filters/changeuser.filter';

import { UserResponse, Login } from 'src/types/user.type';
import { databaseUserForm } from 'src/types/user.type';
import { LoginData, PasswordResetData, UserChange } from './dto/users.dto';

import { AuthGuard } from 'src/guards/authentication.guard';



@Controller('users')
export class UsersController {

    constructor(
        @Inject(UsersService) private userService: UsersService,
    ) {

    }

    @Post('/add')
    @UsePipes(NewUserDataConfirmAndHash)
    @UseFilters(new NewUserValidationFilter())
    async addUser(
        @Body() newUserData: databaseUserForm
    ): Promise<UserResponse> {
        try {
            const id = await this.userService.addUser(newUserData);
            const response = {
                status: true,
                info: id,
            }
            return response;
        } catch (err) {
            console.log(err);
            const response = {
                status: false,
                info: 'wystąpił problem podczas dodawania użytkownika... spróbuj za chwilę.'
            }
            return response;
        }

    }

    @Post('/login')
    async userLogin(
        @Body() loginData: LoginData
    ): Promise<Login> {
        const response = await this.userService.userLogin(loginData)
        return response;
    }

    @Get('/activation/:code')
    async userActivation(
        @Param('code') code: string,
    ) {
        try {
            const result = await this.userService.userActivation(code);
            if (result) {
                const response = {
                    info: 'twoje konto zostało aktywowane',
                }
                return JSON.stringify(response);
            } else {
                const response = {
                    info: 'błędny link aktywacyjny...',
                }
                return JSON.stringify(response);
            }

        } catch (err) {
            console.log(err)
            const response = {
                info: 'wystąpił błąd serwera, sprubuj za chwilę...',
            }
            return JSON.stringify(response);
        }
    }

    @Get('/resend/:login')
    async resendActivationLink(
        @Param('login') login: string
    ) {
        try {
            const response = await this.userService.resendActivation(login)
            if (response) return {
                status: true,
                info: 'Link aktywacyjny został ponownie wysłany'
            }

            return {
                status: false,
                info: 'Podany login nie istnieje lub jest już aktywny'
            }
        } catch (err) {
            console.log(err)
            return {
                status: false,
                info: 'Wystąpił problem z serwerem... spróbuj za chwilę'
            }
        }
    }

    @Get('/check/:login')
    async checkUser(
        @Param('login') login: string
    ) {
        try {
            const response = await this.userService.activatePasswordChanging(login)
            return response
        } catch (err) {
            console.log(err)
            return {
                status: false,
                info: 'Wystąpił problem z serwerem, spróbuj za chwilę'
            }
        }

    }

    @Get('/reset/:code')
    async confirmUserPasswordChange(
        @Param('code') code: string
    ) {
        const response = await this.userService.passwordChangingConfirmation(code);
        return response;
    }

    @UsePipes(ResetPasswordVaildationPipe)
    @UseFilters(new NewUserValidationFilter())
    @Put('/reset')
    async resetPassword(
        @Body() data: PasswordResetData
    ) {
        try {
            const response = await this.userService.passwordReset(data);
            return response
        } catch (err) {
            console.log(err)
            return {
                status: false,
                info: 'Wystąpił problem z serwerem... '
            }
        }

    }

    @Patch('/change')
    @UseGuards(AuthGuard)
    @UsePipes(UserDataChangeValidationPipe)
    @UseFilters(new DataChangeExceptionFilter())
    async changeUserData(
        @Body() data: UserChange,
        @Headers() headers: any
    ) {
        try {
            const key = headers.token as string
            const response = await this.userService.userDataChange(data, key)
            return response
        } catch (err) {
            console.log(err)
            return {
                status: false,
                info: 'Wystąpił błąd podaczas zmiany danych... '
            }
        }

    }

    @Delete('/change/:id')
    @UseGuards(AuthGuard)
    async deleteUser(
        @Param('id') id: string
    ) {
        try {
            await this.userService.deleteUser(id);
            return {
                status: true,
                info: 'ok'
            }
        } catch (err) {
            return {
                status: false,
                info: 'Wystąpił problem w trakcie usuwania... '
            }
        }
    }
}

