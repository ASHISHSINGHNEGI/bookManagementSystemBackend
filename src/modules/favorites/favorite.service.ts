import { favoriteRepository } from './favorite.repository';
import { bookRepository } from '../books/book.repository';
import { AppError } from '../../errors/AppError';

export const favoriteService = {
  add: async (userId: string, bookId: string) => {
    const book = await bookRepository.findById(bookId);
    if (!book) throw AppError.notFound('Book not found');

    const existing = await favoriteRepository.findByUserAndBook(userId, bookId);
    if (existing) throw AppError.conflict('Book is already in your favorites');

    return favoriteRepository.create(userId, bookId);
  },

  getAll: async (userId: string) => {
    const favorites = await favoriteRepository.findAllByUser(userId);
    // Exclude favorites whose book has been soft-deleted
    return favorites.filter((f) => f.book && !f.book.isDeleted);
  },

  remove: async (userId: string, bookId: string) => {
    const existing = await favoriteRepository.findByUserAndBook(userId, bookId);
    if (!existing) throw AppError.notFound('Favorite not found');

    return favoriteRepository.delete(userId, bookId);
  },
};
