import {SysBackgroundProcess} from '../entities/background-process.entity'
import {SysProcessStatus} from '../types/background-process.types'

export class BackgroundProcessControlUtils {

  static async getProcesses(): Promise<SysBackgroundProcess[]> {
    return SysBackgroundProcess.findAll()
  }

  static async updateProcessScheduleAndStartParams(body: Partial<SysBackgroundProcess>): Promise<SysBackgroundProcess | null> {
    if (!body.id) {
      return null
    }
    const process = await SysBackgroundProcess.findByPk(body.id)
    if (!process) {
      return null
    }
    process.set(body)
    return process.save()
  }

  static async stopProcess(processId: number): Promise<SysBackgroundProcess> {
    const bgProcess = await SysBackgroundProcess.findByPk(processId)
    // await getManager().findOneOrFail( SysBackgroundProcess, processId )
    if (bgProcess.status === SysProcessStatus.working) {
      bgProcess.status = SysProcessStatus.stopping
      await bgProcess.save()
    }
    if (bgProcess.status === SysProcessStatus.starting) {
      bgProcess.status = null
      await bgProcess.save()
    }
    return bgProcess
  }

  static async startProcess(processId: number, startParams: any = undefined): Promise<SysBackgroundProcess> {
    const bgProcess = await SysBackgroundProcess.findByPk(processId)
    if (!bgProcess.status) {
      bgProcess.status = SysProcessStatus.starting
      if (startParams !== undefined) {
        bgProcess.startParams = startParams
      }
      await bgProcess.save()
    }
    return bgProcess
  }
}
