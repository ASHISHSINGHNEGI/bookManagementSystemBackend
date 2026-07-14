import { prisma } from '../../config/database.config';

export const categoryRepository = {
  findAll: () => {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { children: true },
    });
  },

  findById: (id: string) => {
    return prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
  },

  create: (data: { name: string; parentId?: string | null }) => {
    return prisma.category.create({ data });
  },

  update: (id: string, data: { name: string }) => {
    return prisma.category.update({ where: { id }, data });
  },

  delete: (id: string) => {
    return prisma.category.delete({ where: { id } });
  },

  getCategoryPath: async (categoryId: string): Promise<string[]> => {
    // Recursive CTE to build full ancestor path
    const result = await prisma.$queryRaw<Array<{ path: string[] }>>`
      WITH RECURSIVE category_path AS (
        SELECT id, name, parent_id, ARRAY[name::text] AS path
        FROM categories
        WHERE id = ${categoryId}::uuid
        UNION ALL
        SELECT c.id, c.name, c.parent_id, ARRAY[c.name::text] || cp.path
        FROM categories c
        JOIN category_path cp ON c.id = cp.parent_id
      )
      SELECT path FROM category_path WHERE parent_id IS NULL
    `;
    return result[0]?.path ?? [];
  },

  hasChildren: async (id: string): Promise<boolean> => {
    const count = await prisma.category.count({ where: { parentId: id } });
    return count > 0;
  },

  hasBooks: async (id: string): Promise<boolean> => {
    const count = await prisma.book.count({ where: { categoryId: id, isDeleted: false } });
    return count > 0;
  },
};
