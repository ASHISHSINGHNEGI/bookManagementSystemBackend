import { prisma } from '../../config/database.config';

export const adminRepository = {
  getFavoritesByDay: async (): Promise<Array<{ date: string; count: number }>> => {
    // Raw SQL for date grouping — Prisma doesn't support DATE() aggregation natively
    const result = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT
        DATE(f.created_at) AS date,
        COUNT(*) AS count
      FROM favorites f
      WHERE f.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(f.created_at)
      ORDER BY date ASC
    `;

    // Convert BigInt count and Date to serializable primitives
    return result.map((row) => ({
      date: row.date.toISOString().split('T')[0],
      count: Number(row.count),
    }));
  },
};
