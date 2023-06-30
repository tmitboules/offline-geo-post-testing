import { MutationCache, QueryClient } from "@tanstack/react-query"
import { addPostsWithAxios } from "../network/api"
import { addPostKey } from "../network/usePost"

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
            defaultQueryClient.invalidateQueries(['posts'])
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
      });

      return {
        defaultQueryClient
      }
}
