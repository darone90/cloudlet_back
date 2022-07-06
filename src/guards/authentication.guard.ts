import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';


@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const key = request.headers.token
        console.log(key);

        return true;
    }
}
