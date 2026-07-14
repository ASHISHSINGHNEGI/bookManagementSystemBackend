import { prisma } from '../../config/database.config';
import { Prisma } from '@prisma/client';

export interface BookFilters {
  search?: string;
  author?: string;
  categoryId?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  skip: number;
  limit: number;
}

export const bookRepository = {
  findAll: async (filters: BookFilters) => {
    const where: Prisma.BookWhereInput = {
      isDeleted: false,
      ...(filters.search && {
        title: { contains: filters.search, mode: 'insensitive' },
      }),
      ...(filters.author && {
        author: { contains: filters.author, mode: 'insensitive' },
      }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
    };

    const sortField = filters.sortBy ?? 'createdAt';
    const sortOrder = filters.order ?? 'desc';
    const orderBy: Prisma.BookOrderByWithRelationInput = { [sortField]: sortOrder };

    const [books, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        orderBy,
        skip: filters.skip,
        take: filters.limit,
        include: { category: true, creator: { select: { id: true, name: true } } },
      }),
      prisma.book.count({ where }),
    ]);

    return { books, total };
  },

  findById: (id: string) => {
    return prisma.book.findFirst({
      where: { id, isDeleted: false },
      include: { category: true, creator: { select: { id: true, name: true } } },
    });
  },

  create: (data: {
    title: string;
    author: string;
    description?: string;
    coverImage?: string;
    categoryId: string;
    createdBy: string;
  }) => {
    return prisma.book.create({
      data,
      include: { category: true },
    });
  },

  update: (
    id: string,
    data: Partial<{
      title: string;
      author: string;
      description: string;
      coverImage: string;
      categoryId: string;
    }>
  ) => {
    return prisma.book.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  softDelete: (id: string) => {
    return prisma.book.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
