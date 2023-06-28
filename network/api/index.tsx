import baseInstance from "../../instances/baseInstance";
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
