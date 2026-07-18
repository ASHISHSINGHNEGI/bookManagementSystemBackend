import { bookRepository, BookFilters } from './book.repository';
import { categoryRepository } from '../categories/category.repository';
import { AppError } from '../../errors/AppError';
import { parsePagination, buildPaginatedResponse } from '../../utils/pagination.util';

export const bookService = {
  getAll: async (query: Record<string, unknown>) => {
    const { page, limit, skip } = parsePagination(query);

    const filters: BookFilters = {
      search: query.search as string | undefined,
      author: query.author as string | undefined,
      categoryId: query.categoryId as string | undefined,
      sortBy: query.sortBy as string | undefined,
      order: (query.order as 'asc' | 'desc') ?? 'desc',
      skip,
      limit,
    };

    const { books, total } = await bookRepository.findAll(filters);
    return buildPaginatedResponse(books, total, page, limit);
  },

  getById: async (id: string) => {
    console.log("BS id: ", id)

    const book = await bookRepository.findById(id);
    if (!book) throw AppError.notFound('Book not found');

    const categoryPath = await categoryRepository.getCategoryPath(book.categoryId);
    return { ...book, categoryPath };
  },

  create: async (
    data: {
      title: string;
      author: string;
      description?: string;
      coverImage?: string;
      categoryId: string;
    },
    createdBy: string
  ) => {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) throw AppError.badRequest('Category not found');

    // Enforce leaf-only rule: category must have no children
    const hasChildren = await categoryRepository.hasChildren(data.categoryId);
    if (hasChildren) {
      throw AppError.badRequest('Books can only be assigned to leaf categories (categories with no subcategories)');
    }

    return bookRepository.create({ ...data, createdBy });
  },

  update: async (
    id: string,
    data: Partial<{
      title: string;
      author: string;
      description: string;
      coverImage: string;
      categoryId: string;
    }>
  ) => {
    const book = await bookRepository.findById(id);
    if (!book) throw AppError.notFound('Book not found');

    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) throw AppError.badRequest('Category not found');

      const hasChildren = await categoryRepository.hasChildren(data.categoryId);
      if (hasChildren) {
        throw AppError.badRequest('Books can only be assigned to leaf categories');
      }
    }

    return bookRepository.update(id, data);
  },

  delete: async (id: string) => {
    const book = await bookRepository.findById(id);
    if (!book) throw AppError.notFound('Book not found');
    return bookRepository.softDelete(id);
  },
};
