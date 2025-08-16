import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiResultInterceptor, Public } from '@rka/back-utils'
import { GetJobRequestDTO, GetJobResponseDTO } from '@rka/core-utils'
import { JobService } from '../services/job.service'


@ApiTags( 'Задачи' )
@UseInterceptors( new ApiResultInterceptor() )
@Public()
@Controller( 'job' )
export class JobController {
  constructor( private jobService: JobService ) {
  }

  @Post( 'get' )
  async getJob( @Body() body: GetJobRequestDTO ): Promise<GetJobResponseDTO> {
    return this.jobService.getJobsData( body )
  }
}
