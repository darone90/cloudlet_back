import { ExceptionFilter, Catch, ArgumentsHost, NotAcceptableException } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotAcceptableException)
export class DataChangeExceptionFilter implements ExceptionFilter {
    catch(exception: NotAcceptableException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const outcome = {
            status: false,
            info: (exception.getResponse() as any).error
        }
        response
            .json(outcome)
    }
}