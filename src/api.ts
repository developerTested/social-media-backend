import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import dotenvExpended from "dotenv-expand"
import cors from 'cors';
import authRouter from './routes/auth.ts';
import postRouter from './routes/post.ts';

const myEnv = dotenv.config();
dotenvExpended.expand(myEnv);

const port = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || 'localhost';

const corsOptions = {
    origin: process.env.CORS_HOST || '*',
    credentials: true,
    optionSuccessStatus: 200,
    port: port,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());


/**
 * API Home Page
 */
app.get("/", (req, res) => {
    return res.status(200).json({
        login: `http://${HOST_NAME}:${port}/auth/login`,
        register: `http://${HOST_NAME}:${port}/auth/register`,
        logout: `http://${HOST_NAME}:${port}/auth/logout`,
        forgot_password: `http://${HOST_NAME}:${port}/auth/resetPassword`,
        emoji: `http://${HOST_NAME}:${port}/emoji`,
        events: `http://${HOST_NAME}:${port}/events`,
        notifications: `http://${HOST_NAME}:${port}/notifications`,
        feed: `http://${HOST_NAME}:${port}/feed`,
        photos: `http://${HOST_NAME}:${port}/user/photos`,
        current_user: `http://${HOST_NAME}:${port}/user`,
        profile: `http://${HOST_NAME}:${port}/{user}`,
        albums: `http://${HOST_NAME}:${port}/{user/albums`,
        videos: `http://${HOST_NAME}:${port}/{user}/photos`,
        users: `http://${HOST_NAME}:${port}/users`,

    });
});

// Authentication
app.use('/auth', authRouter)

// Post
app.use('/posts', postRouter)

/**
 * Handle 404 Errors
 */
app.get('*', function (req: Request, res: Response) {
    return res.status(404).json({
        error: true,
        message: "Page not Found!",
    });
});

app.post('*', function (req: Request, res: Response) {
    return res.status(404).json({
        error: true,
        message: "Page not Found!",
    });
});

/**
 * Server startup
 */
app.listen(port as number, HOST_NAME, () =>
    console.log(`Server is running at http://${HOST_NAME}:${port}`)
);

export default app;