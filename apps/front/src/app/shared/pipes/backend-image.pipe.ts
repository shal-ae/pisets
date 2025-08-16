import { inject, Pipe, PipeTransform } from '@angular/core'
import { ConfigService } from '../services/config.service'

@Pipe( {
  name: 'backendImage',
  standalone: true,
} )
export class BackendImagePipe implements PipeTransform {
  config = inject( ConfigService )

  transform( value: string ): string {
    return `${this.config.config.localErpFilesBackend}${value}`
  }
}
