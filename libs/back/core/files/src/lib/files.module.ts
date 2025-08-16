import { BullModule } from '@nestjs/bullmq'
import { DynamicModule, Module } from '@nestjs/common'
import { JobModule } from '@rka/job-back'
import { FilesController } from './controllers/files.controller'
import { ConvertOfficeService } from './services/convert-office.service'
import { ConvertPdfService } from './services/convert-pdf.service'
import { FilesProcessor } from './services/files.processor'
import { FilesService } from './services/files.service'
import { MakePdfService } from './services/make-pdf.service'
import { FILES_CONFIG_TOKEN, FilesModuleConfig } from './types/files-module.types'
import { FILES_QUEUE } from './types/job.const'

@Module( {} )
export class FilesModule {
  static forRoot( config: FilesModuleConfig ): DynamicModule {
    return {
      global: true,
      module: FilesModule,
      imports: [
        JobModule,
        BullModule.registerQueue( { name: FILES_QUEUE } ),
      ],
      controllers: [
        FilesController,
      ],
      providers: [
        FilesService,
        FilesProcessor,
        ConvertOfficeService,
        ConvertPdfService,
        MakePdfService,
        {
          provide: FILES_CONFIG_TOKEN,
          useValue: config,
        },
      ],
      exports: [ MakePdfService, FilesService ],
    }
  }
}
