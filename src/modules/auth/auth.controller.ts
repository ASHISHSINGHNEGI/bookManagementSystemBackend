import { NextFunction, Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../utils/response.util";
import { authService } from "./auth.service";

export const authController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    console.log("register controller");
    try {
      const result = await authService.register(req.body);
      sendCreated(res, "Registration successful", result);
    } catch (err) {
      next(err);
    }
  },

  login: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, "Login successful", result);
    } catch (err) {
      next(err);
    }
  },

  refresh: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      sendSuccess(res, "Token refreshed successfully", result);
    } catch (err) {
      next(err);
    }
  },

  logout: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await authService.logout(req.user!.id, refreshToken);
      sendSuccess(res, "Logged out successfully");
    } catch (err) {
      next(err);
    }
  },
};
