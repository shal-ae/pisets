import { inject } from '@angular/core'
import { AppService } from '../../../shared/services/app.service'
import { AuthService } from '../../../shared/services/auth.service'
import { Titles } from '../../../shared/types/titles'

export const settingsUsersPageResolver = {
  res: () => {
    const app = inject( AppService )
    app.title.set( Titles.settingsUsers )
    return inject( AuthService ).load()
  },
}
