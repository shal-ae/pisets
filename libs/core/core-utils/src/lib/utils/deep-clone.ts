export type Nullable<T> = T | undefined | null;

export function isNil<T>( value: Nullable<T> ): value is null | undefined {
  return value === null || typeof value === 'undefined'
}

export function deepClone<T>( value: T ): T {
  return isNil( value ) ? value : JSON.parse( JSON.stringify( value ) )
}
