import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthorizationExcepitonFilter } from './filters/athuser.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new AuthorizationExcepitonFilter())
  await app.listen(8080);
}
bootstrap();
