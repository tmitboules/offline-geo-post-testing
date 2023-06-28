import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager, MutationCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { AppStateStatus, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppState } from './hooks/useAppState';

import { useOnlineManager } from './hooks/useOnlineManager';
import { addPostsWithAxios } from './network/api';
import { addPostKey } from './network/usePost';
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

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      cacheTime: Infinity,
    },
    queries: {
      cacheTime: Infinity,
    }
  },
  mutationCache: new MutationCache({
    onSuccess: (data) => {
      console.log('Mutation success', data)
      queryClient.invalidateQueries(['posts'])
    },
    onError: (error) => {
      console.log('Mutation error', error)
      alert('there is an error in mutation cache.')
    },
  }),
})

queryClient.setMutationDefaults(addPostKey, {
  mutationFn: async (data) => {
    // // to avoid clashes with our optimistic update when an offline mutation continues
    await queryClient.cancelQueries(addPostKey);
    return addPostsWithAxios(data);
  },
});

export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ maxAge: Infinity, persister: asyncStoragePersister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}>
      <SafeAreaProvider>
        <StatusBar style='dark' />
        <TabOneScreen />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
