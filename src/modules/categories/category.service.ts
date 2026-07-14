import { categoryRepository } from './category.repository';
import { AppError } from '../../errors/AppError';

export const categoryService = {
  getAll: () => {
    return categoryRepository.findAll();
  },

  getById: async (id: string) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw AppError.notFound('Category not found');

    const categoryPath = await categoryRepository.getCategoryPath(id);
    return { ...category, categoryPath };
  },

  create: async (data: { name: string; parentId?: string | null }) => {
    if (data.parentId) {
      const parent = await categoryRepository.findById(data.parentId);
      if (!parent) throw AppError.badRequest('Parent category not found');
    }
    return categoryRepository.create(data);
  },

  update: async (id: string, data: { name: string }) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw AppError.notFound('Category not found');
    return categoryRepository.update(id, data);
  },

  delete: async (id: string) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw AppError.notFound('Category not found');

    const hasChildren = await categoryRepository.hasChildren(id);
    if (hasChildren) throw AppError.badRequest('Cannot delete a category that has subcategories');

    const hasBooks = await categoryRepository.hasBooks(id);
    if (hasBooks) throw AppError.badRequest('Cannot delete a category that contains books');

    return categoryRepository.delete(id);
  },
};
