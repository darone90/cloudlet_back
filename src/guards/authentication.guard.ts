import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/users/users.entity';


@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const key = request.headers.token;
        const name = request.headers.name;

        const decoded = decodeURIComponent(name)

        const result = await UserEntity.findOne({
            where: {
                id: key,
                login: decoded
            }
        })

        if (result) return true;
        throw new UnauthorizedException();
        return false;
    }
}
