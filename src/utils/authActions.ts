import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CreateUser, User } from "../types/authTypes.ts";
import { exclude } from "./helper.ts";
import db from "./db.ts";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function findUserByEmail(email: string) {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}


export function createUserByEmailAndPassword(user: CreateUser) {
    user.password = bcrypt.hashSync(user.password, 12);
    exclude(user, ["passwordConfirmation"]);

    return db.user.create({
        data: user,
    });
}

export function findUserById(userId: number) {
    return db.user.findUnique({
        where: {
            id: userId,
        },
    });
}

export function generateAccessToken(user: User) {
    return jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h',
    });
}

export function generateRefreshToken(user: User, jti: string) {
    return jwt.sign({
        userId: user.id,
        jti
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '8h',
    });
}

export function generateTokens(user: User, jti: string) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
}