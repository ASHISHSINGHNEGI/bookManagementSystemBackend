import { adminRepository } from './admin.repository';

export const adminService = {
  getFavoritesReport: () => {
    return adminRepository.getFavoritesByDay();
  },
};
