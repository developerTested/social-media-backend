import db from "../utils/db.ts"
import { Request, Response } from "express"
import { getPostByUserType, newPostBody } from "../schema/postSchema.ts";
import { AuthRequest } from "../types/authTypes.ts";
import { stringifyToJSON } from "../utils/helper.ts";

export async function postList(req: AuthRequest<{}, {}, getPostByUserType>, res: Response) {

    const currentUser = req.currentUser;

    try {
        const post = await db.post.findMany({
            where: {
                authorId: currentUser,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        avatar: true,
                    }
                },
                comments: {
                    where: {
                        parentId: null,
                    },
                    include: {
                        replies: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.json(stringifyToJSON(post)); // Return the post object if found
    } catch (error) {
        console.error('Error finding post:', error);
        throw error; // Handle the error appropriately
    }
}

export async function createPost(req: AuthRequest<{}, {}, newPostBody>, res: Response) {

    const data = req.body;

    const currentUser = req.currentUser;

    try {
        const post = await db.post.findFirst({
            where: {
                authorId: currentUser,
                content: data.message,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        avatar: true,
                    }
                },
            }
        });

        if (post) {
            // If a post with the same content exists, return a custom status code
            return res.status(409).json({
                error: true,
                message: 'Post already exists',
            });
        }

        // Create a new post if it doesn't exist
        const newPost = await db.post.create({
            data: {
                authorId: currentUser,
                content: data.message,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        avatar: true,
                    }
                },
            }
        });

        // Return the newly created post

        return res.status(201).json({
            success: true,
            message: "Post has been created!",
            post: stringifyToJSON(newPost),
        });

    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            error: true,
            message: 'Internal server error',
        });
    }
}


export async function updatePost() {

}


export async function deletePost() {

}


export async function postComment(req: AuthRequest, res: Response) {

    const user_id = req.currentUser;
    const post_id = req.params.id as unknown as number;
    const parentId = req.body.parentId;

    const commentData = {
        parentId,
        postId: post_id,
        userId: user_id,
        content: req.body.message,
    }
    const content = req.body.message;

    try {

        const commentExists = await db.comment.findFirst({
            where: commentData,
        })

        if (commentExists) {
            return res.status(409).json({
                error: true,
                message: "You've already posted same comment!",
            });
        }

        const comment = await db.comment.create({
            data: commentData
        });

        return res.json({
            success: true,
            comment: stringifyToJSON(comment),
        });
    } catch (error) {
        console.error('Error posting comment:', error);
        return res.status(500).json({
            error: true,
            message: 'Internal server error',
        });
    }
}