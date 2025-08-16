import { signalStoreFeature, withState } from '@ngrx/signals'

export type NotFoundState = { notFound: boolean };

export function withNotFoundStatus() {
  return signalStoreFeature( withState<NotFoundState>( { notFound: false } ) )
}

export function setNotFoundTrue(): NotFoundState {
  return { notFound: true }
}

export function setNotFoundFalse(): NotFoundState {
  return { notFound: false }
}
