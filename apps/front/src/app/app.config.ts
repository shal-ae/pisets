import { registerLocaleData } from '@angular/common'
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http'
import ru from '@angular/common/locales/ru'
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, Provider } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideNzI18n, ru_RU } from 'ng-zorro-antd/i18n'
import { routes } from './app.routes'
import { AuthInterceptor } from './shared/interceptors/auth.interceptor'
import { ConfigService } from './shared/services/config.service'

registerLocaleData( ru )

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
}

const appInitializerFn = ( configService: ConfigService ) => {
  return () => configService.init()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter( routes, withComponentInputBinding() ),
    provideNzI18n( ru_RU ),
    importProvidersFrom( FormsModule ),
    provideAnimationsAsync(),
    provideHttpClient( withInterceptorsFromDi(), withFetch() ),
    INTERCEPTOR_PROVIDER,
    // provideClientHydration(),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ ConfigService ],
    },
  ],
}
