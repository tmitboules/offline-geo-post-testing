import baseInstance from "../../instances/baseInstance";
import { ContentVideo, ContentVideoResponse } from "../../Models/ContentVideo";
import { Post, PostResponse } from "../../Models/Post";

export const addPostsWithAxios = async (post: Post): Promise<any> => {
    const instance = await baseInstance();
    const { data } = await instance.post("locatedPost/Create", post);
    return data;
};

export const getPostList = async (): Promise<PostResponse> => {
    const instance = await baseInstance();
    const { data }: { data: PostResponse } = await instance.get("locatedPost/GetList");
    return data;
};

export const addContentVideo = async (contentVideo: ContentVideo): Promise<ContentVideo> => {
    const instance = await baseInstance();
    console.log('contentVideocontentVideo', contentVideo)
    const { data } = await instance.post("contentVideo", contentVideo);
    return data;
};

export const getContentVideoList = async (): Promise<ContentVideoResponse> => {
    const instance = await baseInstance();
    const { data }: { data: ContentVideoResponse } = await instance.get("contentVideo");
    return data;
};
