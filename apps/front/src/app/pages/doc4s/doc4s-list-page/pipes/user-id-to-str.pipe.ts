import { inject, Pipe, PipeTransform } from '@angular/core'
import { AuthService } from '../../../../shared/services/auth.service'

@Pipe( {
  name: 'userIdToStr',
  standalone: true,
} )
export class UserIdToStrPipe implements PipeTransform {
  auth = inject( AuthService )

  transform( value: number | null ): string {
    if ( value === null ) {
      return '?'
    }
    return this.auth.users.entityMap()[ value ]?.name ?? '?'
  }
}
