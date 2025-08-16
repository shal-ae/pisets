import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common'

@Injectable( { scope: Scope.TRANSIENT } )
export class MyLogger extends ConsoleLogger {
  send( message: string, logLevel: LogLevel = 'log' ): void {
    switch ( logLevel ) {
      case 'debug':
        this.debug( message )
        break
      case 'error':
        this.error( message )
        break
      case 'verbose':
        this.verbose( message )
        break
      case 'warn':
        this.warn( message )
        break
      default:
        this.log( message )
    }
  }
}
