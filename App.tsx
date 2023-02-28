import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MutationCache, QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import baseInstance from './instances/baseInstance';
import { Post } from './Models/Post';
import { Button, TextInput } from 'react-native';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (data) => {
     console.log('Mutation success')
    },
    onError: (error) => {
      console.log('Mutation error', error)
    },
  }),
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
})


export const addPost = async (post: Post): Promise<Post> => {
  const instance = await baseInstance();

  const { data } = await instance.post("/locatedPost/Create", post);
  return data;
};

export const useAddPost = () => {

  
  return useMutation(addPost, {
    mutationKey: ['addPost'],
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['addPost'] });
      const previousData = queryClient.getQueryData(['addPost']);
      queryClient.setQueryData(['addPost'], (old: any) => {
       return {...old}
      });
      return { previousData };
    },
    onSuccess() {

    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['addPost'], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['addPost'] });
    },
  });
};


export default function App() {

  const colorScheme = useColorScheme();

    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}>
         <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    );
}
