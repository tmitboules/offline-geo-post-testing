import { MutationCache, QueryClient } from "@tanstack/react-query"

import { addPost, deletePost, updatePost } from "../network/api"
import { addPostKey, postsKey, updatePostKey, deletePostKey } from "../network/usePost"

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
      return addPost(data);
    },
    onSuccess: () => {
      defaultQueryClient.invalidateQueries(postsKey)
    }
  });

  defaultQueryClient.setMutationDefaults(updatePostKey, {
    mutationFn: async (data) => {
      // // to avoid clashes with our optimistic update when an offline mutation continues
      await defaultQueryClient.cancelQueries(updatePostKey);
      return updatePost(data);
    },
    onSuccess: () => {
      defaultQueryClient.invalidateQueries(postsKey)
    }
  });

  defaultQueryClient.setMutationDefaults(deletePostKey, {
    mutationFn: async (data) => {
      // // to avoid clashes with our optimistic update when an offline mutation continues
      await defaultQueryClient.cancelQueries(deletePostKey);
      return deletePost(data);
    },
    onSuccess: () => {
      // defaultQueryClient.invalidateQueries(postsKey)
    }
  });

  return {
    defaultQueryClient
  }
}
