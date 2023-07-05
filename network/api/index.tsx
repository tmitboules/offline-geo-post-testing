import baseInstance from "../../instances/baseInstance";
import { Post } from "../../Models/Post";

export const addPost = async (post: Post): Promise<any> => {
    const instance = await baseInstance();
    const { data } = await instance.post("posts", post);
    return data;
};

export const updatePost = async (post: Post): Promise<any> => {
    const instance = await baseInstance();
    const { data } = await instance.put(`posts/${post.id}`, post);
    return data;
};

export const deletePost = async (id: number): Promise<any> => {
    const instance = await baseInstance();
    const { data } = await instance.delete(`posts/${id}`);
    return data;
};

export const getPostList = async (): Promise<Post[]> => {
    const instance = await baseInstance();

    const { data }: { data: Post[] } = await instance.get("posts");

    return data;
};