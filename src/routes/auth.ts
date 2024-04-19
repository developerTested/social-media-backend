import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/authController.ts";
import validateRequest from "../validations/validateRequest.ts";
import { LoginSchema, RegisterSchema } from "../schema/authSchema.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const authRouter = Router();

authRouter.post('/login', validateRequest(LoginSchema), login);
authRouter.post('/register', validateRequest(RegisterSchema), register);
authRouter.post('/logout', authMiddleware, logout);
authRouter.post('/refreshToken', refreshToken);

export default authRouter;