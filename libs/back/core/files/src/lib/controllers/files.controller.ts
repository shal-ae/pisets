import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultInterceptor, Public } from '@rka/back-utils'
import {
  AddJobResponseItem,
  DEFAULT_FILE_UPLOAD_OPTIONS,
  FileUploadOptions,
  FileUploadRequestBody,
} from '@rka/core-utils'
import { FILES_JOB_TTL, FILES_QUEUE, JOB_MAKE_SECONDARY_FILES } from '@rka/files'
import { JobService } from '@rka/job-back'
import { diskStorage } from 'multer'
import { FilesService } from '../services/files.service'
import { FileUploadResultDTO } from '../types/file-upload-response.types'
import { UploadFileJobOptions } from '../types/files-queue.types'

@ApiTags( 'Файлы' )
@UseInterceptors( new ApiResultInterceptor() )
@Controller( 'files' )
export class FilesController {
  constructor(
    private filesService: FilesService,
    private jobService: JobService,
  ) {
  }

  @Public()
  @Post( 'upload' )
  @UseInterceptors(
    FileInterceptor( 'file', {
      storage: diskStorage( {
        destination: './data/temp/upload', // CONST - не работает!!!
      } ),
    } ),
  )
  uploadFile( @UploadedFile() file: Express.Multer.File, @Body() body: FileUploadRequestBody ): Promise<FileUploadResultDTO> {
    return this.filesService.saveUploadedFile( file, this.uploadOptionsFromBody( body ) )
  }

  @Public()
  @Post( 'upload-to-job' )
  @UseInterceptors(
    FileInterceptor( 'file', {
      storage: diskStorage( {
        destination: './data/temp/upload', // CONST - не работает!!!
      } ),
    } ),
  )
  async uploadFileToJob( @UploadedFile() file: Express.Multer.File, @Body() body: FileUploadRequestBody ): Promise<AddJobResponseItem | undefined> {
    const uploadFileJobOptions: UploadFileJobOptions = {
      file,
      options: this.uploadOptionsFromBody( body ),
    }
    const job = await this.jobService.addJob(
      FILES_QUEUE,
      JOB_MAKE_SECONDARY_FILES,
      uploadFileJobOptions,
      FILES_JOB_TTL,
    )
    return this.jobService.jobToAddJobResultDTO( job )
  }

  private uploadOptionsFromBody( body: FileUploadRequestBody ): FileUploadOptions {
    return JSON.parse(
      body?.options || JSON.stringify( DEFAULT_FILE_UPLOAD_OPTIONS ),
    )
  }

}
