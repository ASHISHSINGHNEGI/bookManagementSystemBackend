import bcrypt from "bcrypt";
import { authRepository } from "./auth.repository";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.util";
import { AppError } from "../../errors/AppError";
import { bcryptConfig, jwtConfig } from "../../config/app.config";

const getRefreshTokenExpiry = (): Date => {
  // Parse "7d" → 7 days in ms
  const match = jwtConfig.refreshExpiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + value * multipliers[unit]);
};

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    console.log("register service");
    const roleName = data.role ?? "user";
    const role = await authRepository.findRoleByName(roleName);
    if (!role) throw AppError.badRequest(`Role '${roleName}' does not exist`);

    const existing = await authRepository.findUserByEmail(data.email);
    if (existing)
      throw AppError.conflict("An account with this email already exists");

    const hashedPassword = await bcrypt.hash(
      data.password,
      bcryptConfig.rounds,
    );

    const user = await authRepository.createUser({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      roleId: role.id,
    });

    const accessToken = signAccessToken(user.id, user.role.name);
    const refreshToken = signRefreshToken(user.id);

    await authRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      accessToken,
      refreshToken,
    };
  },

  login: async (email: string, password: string) => {
    const user = await authRepository.findUserByEmail(
      email.toLowerCase().trim(),
    );
    if (!user) throw AppError.unauthorized("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw AppError.unauthorized("Invalid email or password");

    const accessToken = signAccessToken(user.id, user.role.name);
    const refreshToken = signRefreshToken(user.id);

    await authRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      accessToken,
      refreshToken,
    };
  },

  refresh: async (token: string) => {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }

    if (payload.type !== "refresh")
      throw AppError.unauthorized("Invalid token type");

    const stored = await authRepository.findRefreshToken(token);
    if (!stored)
      throw AppError.unauthorized("Refresh token not found or already revoked");

    if (stored.expiresAt < new Date()) {
      await authRepository.deleteRefreshToken(token);
      throw AppError.unauthorized("Refresh token has expired");
    }

    const user = stored.user;
    // Rotate: delete old, issue new
    await authRepository.deleteRefreshToken(token);

    const newAccessToken = signAccessToken(user.id, user.role.name);
    const newRefreshToken = signRefreshToken(user.id);

    await authRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  logout: async (userId: string, refreshToken?: string) => {
    if (refreshToken) {
      await authRepository.deleteRefreshToken(refreshToken).catch(() => null);
    } else {
      await authRepository.deleteAllUserRefreshTokens(userId);
    }
  },
};
