
import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class AuthorizationExcepitonFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const outcome = {
            status: false,
            info: 'Nie masz dostępu do tego zasobu, zaloguj się lub załóż konto'
        }
        response
            .json(outcome)
    }
}