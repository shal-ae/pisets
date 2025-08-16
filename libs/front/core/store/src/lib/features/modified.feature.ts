import { signalStoreFeature, withState } from '@ngrx/signals'

export type ModifiedState = { modified: boolean };

export function withModifiedStatus() {
  return signalStoreFeature( withState<ModifiedState>( { modified: false } ) )
}

export function setModified(): ModifiedState {
  return { modified: true }
}

export function setNotModified(): ModifiedState {
  return { modified: false }
}
