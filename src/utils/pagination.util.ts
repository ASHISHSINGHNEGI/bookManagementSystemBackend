import { PaginatedResponse } from '../types/common.types';

export const parsePagination = (
  query: Record<string, unknown>
): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginatedResponse = <T>(
  data: T[],
  totalRecords: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  return {
    page,
    limit,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
    data,
  };
};
