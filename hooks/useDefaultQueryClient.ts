import { MutationCache, QueryClient } from "@tanstack/react-query"

import { addContentVideo, addPostsWithAxios } from "../network/api"
import { addContentVideoKey, contentVideoKey } from "../network/useContentVideo"
import { addPostKey, postsKey } from "../network/usePost"

export function useDefaultQueryClient() {
     const defaultQueryClient = new QueryClient({
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
            // defaultQueryClient.invalidateQueries(postsKey)
          },
          onError: (error) => {
            console.log('Mutation error', error)
            alert('there is an error in mutation cache.')
          },
        }),
      })
      
      defaultQueryClient.setMutationDefaults(addPostKey, {
        mutationFn: async (data) => {
            // // to avoid clashes with our optimistic update when an offline mutation continues
            await defaultQueryClient.cancelQueries(addPostKey);
            return addPostsWithAxios(data);
        },
        onSuccess: () => {
            defaultQueryClient.invalidateQueries(postsKey)
        }
      });
      
      defaultQueryClient.setMutationDefaults(addContentVideoKey, {
        mutationFn: async (data) => {
            // // to avoid clashes with our optimistic update when an offline mutation continues
            await defaultQueryClient.cancelQueries(addContentVideoKey);
            return addContentVideo(data);
        },
        onSuccess: () => {
            console.log('Mutation success here')
            defaultQueryClient.invalidateQueries(contentVideoKey)
        }
      });

      return {
        defaultQueryClient
      }
}
