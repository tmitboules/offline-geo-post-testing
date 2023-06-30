import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LocatedPostInfo, PostResponse } from "../../Models/Post";
import { addPostsWithAxios, getPostList } from "../api";

export const addPostKey = ['addPost']
export const postsKey = ['posts']

export const useAddPost = () => {
    const queryClient = useQueryClient()
    const addPostMutation = useMutation(addPostsWithAxios, {
        mutationKey: addPostKey,
        async onMutate(newData) {
            await queryClient.cancelQueries({ queryKey: addPostKey });
            const previousData: PostResponse | undefined = queryClient.getQueryData(postsKey)

            const newPost: LocatedPostInfo = {
                id: "",
                added_by: "example_user",
                updated_by: '',
                located_post: {
                    title: newData.title,
                    body: newData.body,
                    geo_location: newData.geo_location,
                    date_added: new Date().toString(),
                    date_updated: '',
                },
            }

            previousData?.locatedPosts.unshift(newPost)
            queryClient.setQueryData(postsKey, previousData)

            return { previousData }
        },
        onSettled: () => {
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

export function useGetPost() {
    return useQuery({
        queryKey: postsKey,
        queryFn: getPostList,
    })
}
