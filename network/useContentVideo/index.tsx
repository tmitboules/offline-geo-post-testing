import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ContentVideo, ContentVideoResponse } from "../../Models/ContentVideo";
import { addContentVideo, getContentVideoList } from "../api";

export const addContentVideoKey = ['addContentVideo']
export const contentVideoKey = ['contentVideo']

export const useAddContentVideo = () => {
    const queryClient = useQueryClient()
    const addContentVideoMutation = useMutation(addContentVideo, {
        mutationKey: addContentVideoKey,
        async onMutate(newData) {
            await queryClient.cancelQueries({ queryKey: addContentVideoKey });
            const previousData: ContentVideoResponse | undefined = queryClient.getQueryData(contentVideoKey)

            const newPost: ContentVideo =  {
                "id": "",
                "links": "",
                "title": newData.title,
                "description":newData.description,
                "userId": "",
                "username": "",
              }

            previousData?.contentVideos.unshift(newPost)
            queryClient.setQueryData(contentVideoKey, previousData)

            return { previousData }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: addContentVideoKey });
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(contentVideoKey, context?.previousData)
        },
    });

    return {
        addContentVideoMutation
    }
};

export function useGetContentViedeos() {
    return useQuery({
        queryKey: contentVideoKey,
        queryFn: getContentVideoList,
    })
}
