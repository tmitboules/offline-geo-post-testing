import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MutationCache, QueryClient, useMutation, focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import ky from 'ky';
import { AppStateStatus, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppState } from './hooks/useAppState';

import useColorScheme from './hooks/useColorScheme';
import { useOnlineManager } from './hooks/useOnlineManager';
import baseInstance from './instances/baseInstance';
import { Post } from './Models/Post';
import Navigation from './navigation';

const addPostkey = ['addPost']

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 2000,
      retry: 2,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (data) => {
     console.log('Mutation success', data)
    },
    onError: (error) => {
      console.log('Mutation error', error)
    },
  }),
})

queryClient.setMutationDefaults(addPostkey, {
  mutationFn: async ({ data }: {data: Post}) => {
    console.log('Hello there ....', data)
    // to avoid clashes with our optimistic update when an offline mutation continues
    await queryClient.cancelQueries(addPostkey);
    return addPost(data);
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
})


export const addPost = async (post: Post) => {
  console.log('POst::::', post)
  ky.post("https://cc-general-service-wus2.azurewebsites.net/locatedPost/Create", { json: post }).json()
};

export const useAddPost = () => {
  const addPostMutation = useMutation({
    mutationKey: addPostkey,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: addPostkey });
      const previousData = queryClient.getQueryData(addPostkey);
      queryClient.setQueryData(addPostkey, (old: any) => {
       return {...old}
      });
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(addPostkey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: addPostkey });
    },
  });

  return {
    addPostMutation
  }
};


export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  const colorScheme = useColorScheme();

    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
        onSuccess={() => {
          // resume mutations after initial restore from localStorage was successful
          queryClient.resumePausedMutations().then(() => {
            queryClient.invalidateQueries();
          });
        }}>
         <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    );
}
