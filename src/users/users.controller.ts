import { Body, Controller, Get, Inject, Param, Post, UsePipes, } from '@nestjs/common';
import { UserResponse, Login } from 'src/types/user.type';
import { UsersService } from './users.service';
import { NewUserDataConfirmAndHash } from 'src/pipes/add-user.pipe';
import { databaseUserForm } from 'src/types/user.type';
import { LoginData } from './dto/users.dto';


@Controller('users')
export class UsersController {

    constructor(
        @Inject(UsersService) private userService: UsersService,
    ) {

    }

    @Post('/login')
    async userLogin(
        @Body() loginData: LoginData
    ): Promise<Login> {
        const response = await this.userService.userLogin(loginData)

        return response;
    }

    @Post('/add')
    @UsePipes(NewUserDataConfirmAndHash)
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
                info: 'error during adding user process...'
            }
            return response;
        }

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
}

