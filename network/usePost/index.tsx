import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPostsWithAxios } from "../api";

export const addPostKey = ['addPost']
export const postsKey = ['posts']

export const useAddPostWithAxios = () => {
    const queryClient = useQueryClient()
    const addPostMutation = useMutation(addPostsWithAxios, {
        mutationKey: addPostKey,
        async onMutate() {
            await queryClient.cancelQueries({ queryKey: addPostKey });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: addPostKey });
        }
    });

    return {
        addPostMutation
    }
};
