import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Post } from "../../Models/Post";
import { addPost, deletePost, getPostList, updatePost } from "../api";

export const addPostKey = ['addPost']
export const updatePostKey = ['updatePost']
export const deletePostKey = ['deletePost']
export const postsKey = ['posts']

export const useAddPost = () => {
    const queryClient = useQueryClient()
    const addPostMutation = useMutation(addPost, {
        mutationKey: addPostKey,
        async onMutate(newData) {
            await queryClient.cancelQueries({ queryKey: addPostKey });
            const previousData: Post[] | undefined = queryClient.getQueryData(postsKey)

            previousData?.push(newData)
            queryClient.setQueryData(postsKey, previousData)

            return { previousData }
        },
        onSettled: (data) => {
            queryClient.invalidateQueries({ queryKey: addPostKey });
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(postsKey, context?.previousData)
        },
    });

    return {
        addPostMutation
    }
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient()
    const updatePostMutation = useMutation(updatePost, {
        mutationKey: updatePostKey,
        async onMutate(newData) {
            await queryClient.cancelQueries({ queryKey: updatePostKey });
            const previousData: Post[] | undefined = queryClient.getQueryData(postsKey)

            if (previousData) {
                const index = previousData.findIndex((item) => item.id === newData.id)

                if (previousData && index >= 0) {
                    previousData[index].title = newData.title
                    previousData[index].body = newData.body
                    queryClient.setQueryData(postsKey, previousData)
                }
            }
            return { previousData }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: updatePostKey });
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(postsKey, context?.previousData)
        },
    });

    return {
        updatePostMutation
    }
};

export const useDeletePost = () => {
    const queryClient = useQueryClient()
    const deletePostMutation = useMutation(deletePost, {
        mutationKey: deletePostKey,
        async onMutate(id: number) {
            await queryClient.cancelQueries({ queryKey: deletePostKey });
            let previousData: Post[] | undefined = queryClient.getQueryData(postsKey)

            previousData = previousData?.filter((item => item.id !== id))
            queryClient.setQueryData(postsKey, previousData)
            return { previousData }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: deletePostKey });
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(postsKey, context?.previousData)
        },
    });

    return {
        deletePostMutation
    }
};

export function useGetPost() {
    return useQuery({
        queryKey: postsKey,
        queryFn: getPostList,
    })
}
