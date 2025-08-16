import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config'
import { BULL_QUEUES } from './job.const'

export const JOB_MODULE_CONFIG = {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
  queueNames: BULL_QUEUES,
}
