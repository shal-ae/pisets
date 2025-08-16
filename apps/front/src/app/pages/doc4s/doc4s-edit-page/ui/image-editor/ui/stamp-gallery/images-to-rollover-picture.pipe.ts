import { inject, Pipe, PipeTransform } from '@angular/core'
import { RolloverPicture } from 'libs/front/core/ui/src'
import { ConfigService } from '../../../../../../../shared/services/config.service'
import { backendLink } from '../../../../../../../shared/types/backend.routes'
import { ImageDesc } from '../../../../../../../shared/types/image-desc.types'

@Pipe( {
  name: 'imagesToRolloverPicture',
  standalone: true,
} )
export class ImagesToRolloverPicturePipe implements PipeTransform {
  cfg = inject( ConfigService )

  transform( value: ImageDesc[], suffix = '' ): RolloverPicture[] {
    return value.map( ( e ) => ({ path: this.cfg.config.apiAddress + backendLink( e.src, suffix ) }) )
  }
}
