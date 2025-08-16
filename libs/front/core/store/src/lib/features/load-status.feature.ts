import { computed } from '@angular/core'
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals'

export type LoadStatus = 'idle' | 'loading' | 'loaded' | { error: string };
export type LoadStatusState = { loadStatus: LoadStatus };

export function withLoadStatus() {
  return signalStoreFeature(
    withState<LoadStatusState>( { loadStatus: 'idle' } ),
    withComputed( ( { loadStatus } ) => ({
      loading: computed( () => loadStatus() === 'loading' ),
      loaded: computed( () => loadStatus() === 'loaded' ),
      loadError: computed( () => {
        const status = loadStatus()
        return typeof status === 'object' ? status.error : null
      } ),
    }) ),
  )
}

export function setLoading(): LoadStatusState {
  return { loadStatus: 'loading' }
}

export function setIdle(): LoadStatusState {
  return { loadStatus: 'idle' }
}

export function setLoaded(): LoadStatusState {
  return { loadStatus: 'loaded' }
}

export function setError( error: string ): LoadStatusState {
  return { loadStatus: { error } }
}
