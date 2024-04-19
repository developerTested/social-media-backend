import { Response, NextFunction } from 'express';
import { AuthRequest } from "../types/authTypes.ts";
import { AUTH_FAILED } from '../utils/constants.ts';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            error: true,
            message: AUTH_FAILED,
        });
    }

    try {
        const token = authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET) as any;

        req.currentUser = decodedToken.userId;


        if (!decodedToken.userId) {
            return res.status(401).json({
                error: true,
                message: AUTH_FAILED,
            });
        }

    } catch (err) {
        console.log(err);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                message: err.message,
            });
        }

        return res.status(401).json({
            error: true,
            message: AUTH_FAILED,
        });
    }

    return next();
}

export default authMiddleware