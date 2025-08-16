import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ApiResult, RequestError } from '@rka/core-utils'
import { map, Observable } from 'rxjs'

@Injectable()
export class ApiResultInterceptor<T> implements NestInterceptor<T, ApiResult<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResult<T>> {
    const t = new Date().getMilliseconds()
    return next.handle().pipe(
      //     catchError(e => of(e)),
      map( ( data: T | any ) => {
        const requestTime = new Date().getMilliseconds() - t
        if ( data instanceof RequestError ) {
          return {
            success: false,
            payload: null,
            userMessage: (data as RequestError).message,
            error: data,
            errorCode: (data as RequestError).errorCode,
            errorClass: data.constructor.name,
            requestTime,
          }
          // } else if ( data instanceof TypeORMError ) {
          //   return {
          //     success: false,
          //     payload: null,
          //     userMessage: getUserMessage( data as TypeORMError ),
          //     error: data,
          //     errorCode: data['errno'],
          //     errorClass: data.constructor.name,
          //     requestTime,
          //   }
          // } else if (data instanceof Error) {
          //     console.log(data)
          //     return {
          //         success: false,
          //         payload: null,
          //         userMessage: '',
          //         error: data,
          //         errorCode: data['errno'],
          //         errorClass: data.constructor.name,
          //         requestTime,
          //     }
        } else {
          return {
            success: true,
            payload: data,
            userMessage: '',
            error: null,
            errorCode: 0,
            errorClass: '',
            requestTime,
          }
        }
      } ),
    )
  }
}
