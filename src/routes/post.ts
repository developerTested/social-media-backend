import { Router } from "express";
import { createPost, postComment, postList } from "../controllers/postController.ts";
import { CreatePostSchema, postCommentSchema } from "../schema/postSchema.ts";
import validateRequest from "../validations/validateRequest.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const postRouter = Router();
/**
 * Create a new Post
 */
postRouter.get('/', authMiddleware, postList);

/**
 * Create a new Post
 */
postRouter.post('/', authMiddleware, validateRequest(CreatePostSchema), createPost);

/**
 * Get post by id
 */
postRouter.get('/:id');


/**
 * Update post by id
 */
postRouter.patch('/:id', authMiddleware);

/**
 * Delete post by id
 */
postRouter.delete('/:id', authMiddleware);

/**
 * Post a new comment
 */
postRouter.post('/:id/comments', authMiddleware, validateRequest(postCommentSchema), postComment);


export default postRouter;