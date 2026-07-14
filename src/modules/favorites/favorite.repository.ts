import { prisma } from '../../config/database.config';

export const favoriteRepository = {
  findByUserAndBook: (userId: string, bookId: string) => {
    return prisma.favorite.findFirst({ where: { userId, bookId } });
  },

  findAllByUser: (userId: string) => {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        book: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  create: (userId: string, bookId: string) => {
    return prisma.favorite.create({
      data: { userId, bookId },
      include: { book: { include: { category: true } } },
    });
  },

  delete: (userId: string, bookId: string) => {
    return prisma.favorite.deleteMany({ where: { userId, bookId } });
  },
};
