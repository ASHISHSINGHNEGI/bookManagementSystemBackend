import { prisma } from "../../config/database.config";

export const authRepository = {
  findRoleByName: (name: string) => {
    console.log("authRepository findRoleByName");
    return prisma.role.findUnique({ where: { name } });
  },

  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findUserById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) => {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  },

  createRefreshToken: (data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) => {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken: (token: string) => {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { role: true } } },
    });
  },

  deleteRefreshToken: (token: string) => {
    return prisma.refreshToken.delete({ where: { token } });
  },

  deleteAllUserRefreshTokens: (userId: string) => {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  },
};
