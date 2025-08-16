import { inject, Pipe, PipeTransform } from '@angular/core'
import { ConfigService } from '../services/config.service'
import { stampSrcToBackendLink } from '../types/backend.routes'

@Pipe( {
  name: 'stampImagePath',
  standalone: true,
} )
export class StampImagePathPipe implements PipeTransform {
  cfg = inject( ConfigService )

  transform( value: string ): string {
    return this.cfg.config.apiAddress + stampSrcToBackendLink( value )
  }
}
