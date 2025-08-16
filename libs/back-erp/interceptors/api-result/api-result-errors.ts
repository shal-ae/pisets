export class RequestError extends Error {
  constructor( public errorCode: number, public message: string ) {
    super( message )
  }
}
