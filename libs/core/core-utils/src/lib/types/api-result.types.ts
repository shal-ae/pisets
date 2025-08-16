export interface ApiResult<T> {
  success: boolean
  payload: T
  userMessage?: string
  errorCode?: number
  error?: unknown
  errorClass?: string
  requestTime?: number
}

export class RequestError extends Error {
  constructor( public errorCode: number, public override message: string ) {
    super( message )
  }
}

export interface ResultError {
  code: number;
  message: string;
}

export interface ActionResultDTO {
  ok: boolean;
  error: ResultError | null;
}


