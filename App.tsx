import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { AppStateStatus, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppState } from './hooks/useAppState';
import { useDefaultQueryClient } from './hooks/useDefaultQueryClient';
import { useOnlineManager } from './hooks/useOnlineManager';
import TabOneScreen from './screens/TabOneScreen';


function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
})

const { defaultQueryClient } = useDefaultQueryClient()

export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  return (
    <PersistQueryClientProvider
      client={defaultQueryClient}
      persistOptions={{ maxAge: Infinity, persister: asyncStoragePersister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        defaultQueryClient.resumePausedMutations().then(() => {
          defaultQueryClient.invalidateQueries();
        });
      }}>
      <SafeAreaProvider>
        <StatusBar style='dark' />
        <TabOneScreen />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
