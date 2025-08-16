import { inject, Pipe, PipeTransform } from '@angular/core'
import { ConfigService } from '../services/config.service'
import { docSrcToBackendLink } from '../types/backend.routes'

@Pipe( {
  name: 'docImagePath',
  standalone: true,
} )
export class DocImagePathPipe implements PipeTransform {
  cfg = inject( ConfigService )

  transform( value: string ): string {
    return this.cfg.config.apiAddress + docSrcToBackendLink( value )
  }
}
