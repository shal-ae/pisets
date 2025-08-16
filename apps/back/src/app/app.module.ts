import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileLocation } from './shared/utils/file-location';
import { DB_MODULE_CONFIG } from './database/db-module.config';
import { DbModule } from '@rka/db';
import { JobModule } from '@rka/job-back';
import { JOB_MODULE_CONFIG } from './job/job-module.config';
import { FilesModule } from '@rka/files';
import { UsersModule } from './users/users.module';
import { StampModule } from './stamp/stamp.module';
import { Doc4sModule } from './doc4s/doc4s.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ServeStaticModule.forRoot( {
      rootPath: FileLocation.getFilesDir(),
      serveRoot: '/files',
    } ),
    DbModule.forRoot( DB_MODULE_CONFIG ),
    JobModule.forRoot( JOB_MODULE_CONFIG ),
    FilesModule.forRoot( {
      filesDir: FileLocation.getFilesDir(),
      tempDir: FileLocation.getTempDir(),
    } ),
    UsersModule,
    StampModule,
    Doc4sModule,
    MailerModule,
    MailModule,
  ],
})
export class AppModule {}
