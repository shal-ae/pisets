export const sleepPromise = ( ms: number ) =>
  new Promise( ( r ) => setTimeout( r, ms ) )
