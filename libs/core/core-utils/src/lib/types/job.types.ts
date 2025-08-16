import { ActionResultDTO } from '@rka/core-utils'
import { JobProgress } from 'bullmq'
import { JobsOptions } from 'bullmq/dist/esm/types'
import { Observable } from 'rxjs'

export type JobStatus = 'completed' | 'failed' | 'active' | 'delayed'
  | 'prioritized' | 'waiting' | 'waiting-children' | 'unknown'

export interface ActionResultJobDTO extends ActionResultDTO {
  job: AddJobResponseItem | null
}

export interface ResultJobDTO {
  jobId: string | null
}

export interface AddJobResponseItem {
  queue: string
  jobId: string
  status: JobStatus | null // null for not found
  jobName: string | null
  payload: object | null | undefined
}

// export interface AddJobResponseItem {
//   queue: string;
//   jobId: string;
//   status: JobStatus | null;
//   jobName: string | null;
//   payload: object | undefined;
// }


export interface JobRequestItem {
  queue: string
  jobId: string
}

export interface GetJobRequestDTO {
  jobs: JobRequestItem[]
  statusesOnly: boolean
}


export interface GetJobResponseItem {
  queue: string
  jobId: string
  status: JobStatus | null // null for not found
  jobName: string | null
  opts?: JobsOptions
  result?: any
  failedReason?: string
  progress?: JobProgress
}

export interface GetJobResponseDTO {
  jobs: GetJobResponseItem[];
}

export interface JobAddItem extends GetJobResponseItem {
  title: string;
  payload: any;
  onComplete: Observable<any> | null;
  onFail: Observable<any> | null;
  removeFromWatchListAfterComplete: boolean;
  removeFromWatchListAfterFail: boolean;
}

export interface JobItem extends JobAddItem {
  id: string;
}

export const isJobStatusFinished = ( status: JobStatus | null ) =>
  status === 'completed' || status === 'failed'

export function makeJobId( queue: string, jobId: string ): string {
  return `${queue}-${jobId}`
}

export function jobStatusToString( status: JobStatus | null ): string {
  switch ( status ) {
    case 'completed':
      return 'Выполнено'
    case 'failed':
      return 'Ошибка'
    case 'active':
      return 'Выполняется'
    case 'delayed':
      return 'Отложено'
    case 'prioritized':
      return 'Приоритет'
    case 'waiting':
      return 'Ожидание'
    case 'waiting-children':
      return 'Ожидание'
  }
  return 'Статус ???'
}
