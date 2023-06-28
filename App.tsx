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
import { LocatedPostInfo, Post, PostResponse } from './Models/Post';
import Navigation from './navigation';

const addPostkey = ['addPost']

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
      retry: 0,
    },
    queries: {
      retry: 2,
      cacheTime: 1000 * 10,
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
  mutationFn: async ({ data }: { data: Post }) => {
    // to avoid clashes with our optimistic update when an offline mutation continues
    await queryClient.cancelQueries(addPostkey);
    return addPostsWithAxios(data);
  },
});

export const addPostsWithAxios = async (post: Post): Promise<any> => {
  const instance = await baseInstance();
  const { data } = await instance.post("locatedPost/Create", post);
  return data;
};

export const useAddPostWithAxios = () => {
  const addPostMutation = useMutation(addPostsWithAxios, {
    mutationKey: addPostkey,
    async onMutate(old) {
      console.log('onMutate:::')
      await queryClient.cancelQueries({ queryKey: addPostkey });
      const previousData = old;
      return { previousData };
    },
    onError: (_, __, context) => {
      console.log('onErrorrrr')
      queryClient.setQueryData(addPostkey, context?.previousData);
    },
    onSettled: () => {
      console.log('onSettled:::')
      queryClient.invalidateQueries({ queryKey: addPostkey });
    },
    onSuccess() {
      console.log('onSuccess')
      // queryClient.invalidateQueries(addPostkey);
      // const postResponse: LocatedPostInfo = {
      //   located_post: {
      //     title: data.title,
      //     body: data.body,
      //     date_added: "",
      //     date_updated: "",
      //     geo_location: data.geo_location
      //   },
      //   id: new Date().toString(),
      //   added_by: '11',
      //   updated_by: ''
      // }
      queryClient.invalidateQueries([...addPostkey, 'posts']);
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
      persistOptions={{ maxAge: Infinity, persister: asyncStoragePersister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
