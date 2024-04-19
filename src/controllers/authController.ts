import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from "express"
import { exclude, stringifyToJSON } from "../utils/helper.ts";
import { AUTH_FAILED } from "../utils/constants.ts";
import { loginBody, registerBody } from "../schema/authSchema.ts";
import { AuthRequest, CreateUser } from "../types/authTypes.ts";
import { createUserByEmailAndPassword, findUserByEmail, generateTokens } from "../utils/authActions.ts";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(req: Request<{}, {}, loginBody>, res: Response) {

    const data = req.body;

    try {

        const user = await findUserByEmail(data.email);

        if (!user || !bcrypt.compareSync(data.password, user.password)) {

            return res.status(401).json({
                error: true,
                message: AUTH_FAILED,
            });
        }

        const newUser = stringifyToJSON(exclude(user, ['password']))
        const { accessToken, refreshToken } = generateTokens(newUser, stringifyToJSON(user.id));

        return res.json({
            success: true,
            user: newUser,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}


export async function register(req: Request<{}, {}, registerBody>, res: Response) {
    const data = req.body;

    const existingUser = await findUserByEmail(data.email);

    if (existingUser) {
        return res.status(422).json({
            error: true,
            message: 'User already exists!',
        });
    }

    try {

        delete data.passwordConfirmation;

        const user = await createUserByEmailAndPassword(data as CreateUser);

        const newUser = exclude(user, ["password"])

        return res.json({
            success: true,
            message: 'Your account has been created!',
            user: stringifyToJSON(newUser),
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
}

export function logout(req: AuthRequest, res: Response) {

    req.currentUser = null;

    try {
        return res.json({
            success: true,
            message: 'Your have been logout successfully!',
        });
    } catch (error) {

    }
}

export function refreshToken(req: Request, res: Response) {
    const { authorization } = req.headers;

    const token = req.query.accessToken as string;

    if (!authorization) {
        return res.status(401).json({
            error: true,
            message: AUTH_FAILED,
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as any;

        const user = decodedToken.user;

        const accessToken = generateTokens(user, stringifyToJSON(user.id));

        return res.json({
            ...accessToken
        })
    } catch (error) {

    }
}