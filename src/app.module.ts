import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from "../ormconfig";
import { NotesModule } from './notes/notes.module';
import { CronModule } from './cron/cron.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(databaseConfig as TypeOrmModuleOptions),
    NotesModule,
    CronModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
