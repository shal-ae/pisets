import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { AddJobResponseItem, GetJobRequestDTO, GetJobResponseDTO, GetJobResponseItem } from '@rka/core-utils'
import { Job, JobProgress, Queue } from 'bullmq'
import { JobsOptions } from 'bullmq/dist/esm/types'
import Redis from 'ioredis'

@Injectable()
export class JobService {
  readonly queues: Queue[] = []

  constructor( @InjectRedis() private readonly redis: Redis ) {
  }

  async addJob( queueName: string, jobName: string,
                data: unknown, ttl = 0, opts?: JobsOptions,
  ): Promise<Job | null> {
    const queue = this.getQueueByName( queueName )
    if ( queue === null ) {
      return null
    }
    const job = await queue.add( jobName, data, opts )
    if ( ttl ) {
      const key = `${job.queueQualifiedName}:${job.id}`
      await this.redis.expire( key, ttl )
    }
    return job
  }


  getQueueByName( name: string ): Queue {
    let q = this.queues.find( e => e.name === name )
    if ( !q ) {
      q = new Queue( name, { connection: this.redis } )
      this.queues.push( q )
    }
    return q
  }


  async getJobsData( request: GetJobRequestDTO ): Promise<GetJobResponseDTO> {
    const res: GetJobResponseDTO = { jobs: [] }
    for ( const item of request.jobs ) {
      res.jobs.push(
        await this.getJobData( item.queue, item.jobId, request.statusesOnly ),
      )
    }
    return res
  }

  async jobToAddJobResultDTO( job: Job ): Promise<AddJobResponseItem> {
    return {
      queue: job.queueName,
      jobId: job.id!,
      status: await job.getState(),
      jobName: job.name,
      payload: job.data,
    }
  }

  async getJobData( queueName: string, jobId: string, statusesOnly: boolean ): Promise<GetJobResponseItem> {
    const queue = this.getQueueByName( queueName )
    if ( queue === null ) {
      return {
        ...this.getNotFoundResponseItem( queueName, jobId ),
        failedReason: 'queue not found',
      }
    }
    const job = await queue.getJob( jobId )
    if ( !job ) {
      return {
        ...this.getNotFoundResponseItem( queueName, jobId ),
        failedReason: 'job not found',
      }
    }
    return this.jobResponseItemFromJob( job, statusesOnly )
  }

  private getNotFoundResponseItem( queueName: string, jobId: string ): GetJobResponseItem {
    return { queue: queueName, jobId, status: null, jobName: null }
  }

  private async jobResponseItemFromJob( job: Job<any, any, string>, statusesOnly: boolean ): Promise<GetJobResponseItem> {
    const jobName = job.name
    const result = job.returnvalue
    const progress: JobProgress = job.progress
    if ( !statusesOnly ) {
      return {
        queue: job.queueName,
        jobId: job.id!,
        status: await job.getState(),
        jobName,
        result,
        progress,
        opts: job.opts,
        failedReason: job.failedReason || undefined,
      }
    } else {
      return {
        queue: job.queueName,
        jobId: job.id!,
        status: await job.getState(),
        jobName,
      }
    }
  }
}
