import { Request  } from "express";
import * as core from "express-serve-static-core";

export interface AuthRequest<B = core.ParamsDictionary, P = any, Q = any> extends Request<B, P, Q> {
    currentUser: number;
}

export type User = {
    id: number,
    username: string,
    display_name: string,
    email: string,
    gender?: "Male" | "Female",
    bio: string,
    birthday: string,
    avatar: string,
}

export type CreateUser = {
    id: number,
    username: string,
    display_name?: string,
    gender?: "Male" | "Female",
    email: string,
    password: string,
}

export type AuthUser = {
    userId: number
}