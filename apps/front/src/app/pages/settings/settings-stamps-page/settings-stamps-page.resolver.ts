import { inject } from '@angular/core'
import { AppService } from '../../../shared/services/app.service'
import { AuthService } from '../../../shared/services/auth.service'
import { Titles } from '../../../shared/types/titles'

export const settingsStampsPageResolver = {
  res: () => {
    const app = inject( AppService )
    app.title.set( Titles.settingsStamps )
    return inject( AuthService ).load()
  },
}
