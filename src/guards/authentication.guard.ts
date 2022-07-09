import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/users/users.entity';
import { SetMetadata } from '@nestjs/common';


@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const key = request.headers.token;
        const name = request.headers.name;



        const result = await UserEntity.findOne({
            where: {
                id: key,
                login: name
            }
        })

        if (result) return true;
        throw new UnauthorizedException();
        SetMetadata('userToken', key);
        return false;
    }
}
