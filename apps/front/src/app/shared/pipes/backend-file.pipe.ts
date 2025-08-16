import { inject, Pipe, PipeTransform } from '@angular/core'
import { ConfigService } from '../services/config.service'
import { backendLink } from '../types/backend.routes'

@Pipe( {
  name: 'backendFile',
  standalone: true,
} )
export class BackendFilePipe implements PipeTransform {
  cfg = inject( ConfigService )

  transform( value: string, suffix = '' ): string {
    return this.cfg.config.apiAddress + backendLink( value, suffix )
  }
}
