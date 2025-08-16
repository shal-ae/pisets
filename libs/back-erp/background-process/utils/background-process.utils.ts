import { CatCatalog } from '../../cat/entities/catalog.entity'
import { InterruptedByUserError } from '../../errors/cat.errors'
import { Schedule } from '../../types/schedule.types'
import { MyUtils } from '../../utils/my-utils'
import { SysBackgroundProcess } from '../entities/background-process.entity'
import { SysProcessEndReason, SysProcessStatus } from '../types/background-process.types'


const DEFAULT_PROCESS_TIMEOUT = 2 * 60 * 1000
const BACKGROUND_PROCESS_LOGGER_NAME = 'Background process'

export class BackgroundProcessUtils {

  static getProcessCode( catalog: CatCatalog, processType: string ) {
    return catalog.code ? catalog.code + '.' + processType : processType.toString()
  }

  static async getBackgroundProcess( code: string ): Promise<SysBackgroundProcess | null> {
    return SysBackgroundProcess.findOne( { where: { code }, rejectOnEmpty: false } )
  }

  static async tick( code: string, message: string ): Promise<SysBackgroundProcess> {
    // console.log('tick', code, message)
    const bgProcess = await BackgroundProcessUtils.getBackgroundProcess( code )
    if ( SysProcessStatus.stopping === bgProcess.status ) {
      throw new InterruptedByUserError( 'Прервано пользователем' )
    }
    if ( !bgProcess.status || bgProcess.status === SysProcessStatus.starting ) {
      BackgroundProcessUtils.setWorking( bgProcess )
    }
    bgProcess.tickCount++
    bgProcess.tickMessage = message
    bgProcess.lastTickAt = new Date()

    await bgProcess.save()

    return bgProcess
  }

  static async finish( code: string, endReason: SysProcessEndReason, endMessage = '', result?: any ): Promise<SysBackgroundProcess> {
    const bgProcess = await BackgroundProcessUtils.getBackgroundProcess( code )
    BackgroundProcessUtils.setFinish( bgProcess, endReason, endMessage, result )
    await bgProcess.save()
    return bgProcess
  }

  static async getBackgroundProcessToStart(): Promise<SysBackgroundProcess | null> {
    await BackgroundProcessUtils.detectAndResetTimeoutProcesses()

    const startingProcesses = await SysBackgroundProcess.findAll(
      { where: { status: SysProcessStatus.starting }, order: [ 'startAt' ] } )
    if ( startingProcesses.length ) {
      return startingProcesses[ 0 ]
    }

    let res = null
    const workingList = await SysBackgroundProcess.findAll( {
      where: { status: null },
      order: [ 'startAt' ],
    } )

    for ( const bgProcess of workingList ) {
      if ( await BackgroundProcessUtils.needToStartBySchedule( bgProcess ) ) {
        res = bgProcess
        break
      }
    }
    return res
  }

  static async addBgProcess( name: string, catalog: CatCatalog, processType: string, schedule?: Schedule ) {
    const code = BackgroundProcessUtils.getProcessCode( catalog, processType )
    let bgProcess = await BackgroundProcessUtils.getBackgroundProcess( code )
    if ( !bgProcess ) {
      bgProcess = SysBackgroundProcess.build()
      bgProcess.catalogId = catalog.id
      bgProcess.code = code
      bgProcess.name = name
      bgProcess.schedule = schedule
      bgProcess.type = processType
      await bgProcess.save()
    }
    return bgProcess
  }

  private static setWorking( bgProcess: SysBackgroundProcess ): void {
    bgProcess.status = SysProcessStatus.working
    bgProcess.statusSince = new Date()
    bgProcess.tickCount = 0
    bgProcess.startAt = new Date()
    bgProcess.endReason = null
  }

  private static setFinish( bgProcess: SysBackgroundProcess, endReason: SysProcessEndReason, endMessage = '', result?: any ): void {
    bgProcess.status = null
    bgProcess.statusSince = new Date()
    bgProcess.endAt = new Date()
    bgProcess.endReason = endReason
    bgProcess.endMessage = endMessage
    if ( result !== undefined ) {
      bgProcess.processResult = result
    }

    if ( bgProcess.endReason === SysProcessEndReason.done ) {
      if ( bgProcess.tickCount ) {
        bgProcess.lastDoneTickTotal = bgProcess.tickCount
      }
      bgProcess.tickCount = 0
      bgProcess.lastDoneAt = new Date()
    }
  }

  private static async detectAndResetTimeoutProcesses() {
    const STATUSES_ON = [ SysProcessStatus.working, SysProcessStatus.stopping ]
    const workingList = await SysBackgroundProcess.findAll( { where: { status: STATUSES_ON } } )
    for ( const bgProcess of workingList ) {
      await bgProcess.reload()
      if ( !STATUSES_ON.find( e => e === bgProcess.status ) ) {
        continue
      }

      if ( Date.now() - bgProcess.lastTickAt.getTime() > DEFAULT_PROCESS_TIMEOUT ) {
        BackgroundProcessUtils.setFinish( bgProcess, SysProcessEndReason.error, 'Timeout', {} )
        await bgProcess.save()
      }
    }
  }

  private static async needToStartBySchedule( bgProcess: SysBackgroundProcess ): Promise<boolean> {
    await bgProcess.reload()

    if ( bgProcess.useSchedule !== true || bgProcess.status !== null || bgProcess.endReason === SysProcessEndReason.error ) {
      return false
    }
    const dayOfWeek = MyUtils.localDayOfWeek( new Date().getDay() )
    if ( !bgProcess.schedule.daysOfWeek.includes( dayOfWeek ) ) {
      return false
    }

    if ( bgProcess.schedule.expiresInMinutes && bgProcess.lastDoneAt ) {
      if ( Date.now() < bgProcess.lastDoneAt.getTime() + bgProcess.schedule.expiresInMinutes * 60 * 1000 ) {
        return false
      }
    }

    const startFromHM = MyUtils.stringToHourMinute( bgProcess.schedule.timeToStartFromStr, 0, 0 )
    const startToHM = MyUtils.stringToHourMinute( bgProcess.schedule.timeToStartToStr, 23, 59 )
    const startFrom = new Date()
    startFrom.setHours( startFromHM.hour, startFromHM.minute, 0 )
    const startTo = new Date()
    startTo.setHours( startToHM.hour, startToHM.minute, 59 )
    const now = new Date()
    return (startFrom < now) && (now < startTo)
  }
}

