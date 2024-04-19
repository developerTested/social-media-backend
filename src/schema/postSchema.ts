import { z } from 'zod';

// Schema for user login
export const CreatePostSchema = z.object({
    message: z.string().refine(value => !!value, {
        message: "Message is required",
    }),
});

export const getPostByUser = z.object({
    userId: z.number().min(1, { message: "User Id is required"}),
})

// Schema for user login
export const postCommentSchema = z.object({
    message: z.string().refine(value => !!value, {
        message: "Message is required",
    }),
})

export type newPostBody = z.infer<typeof CreatePostSchema>;
export type getPostByUserType = z.infer<typeof getPostByUser>