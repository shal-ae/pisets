import { signalStoreFeature, withState } from '@ngrx/signals'

export type DirtyState = { dirty: boolean };

export function withDirtyStatus() {
  return signalStoreFeature( withState<DirtyState>( { dirty: true } ) )
}

export function setDirty(): DirtyState {
  return { dirty: true }
}

export function setNotDirty(): DirtyState {
  return { dirty: false }
}
