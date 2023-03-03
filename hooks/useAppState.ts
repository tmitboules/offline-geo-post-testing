import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(onChange: (status: AppStateStatus) => void) {
  useEffect(() => {
    const appStateListner = AppState.addEventListener('change', onChange);
    return () => {
      appStateListner.remove()
    };
  }, [onChange]);
}
