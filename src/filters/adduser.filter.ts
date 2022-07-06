import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class NewUserValidationFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const outcome = exception instanceof HttpException
            ? { status: false, info: exception.getStatus() }
            : { status: false, info: (exception as Error).message };
        response.json(
            outcome
        )
    }
}