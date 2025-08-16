import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthService } from '../services/auth.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor( private authService: AuthService ) {
  }

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers

    const user = await this.authService.getCurrentUser( headers )
    if ( !user ) {
      return false
    }
    return (
      user.access.isSystemAdmin === true || user.access.isCompanyAdmin === true
    )
  }
}
