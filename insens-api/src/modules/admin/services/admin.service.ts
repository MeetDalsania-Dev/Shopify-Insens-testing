import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { AdminRepository, AdminShopFilters, AdminUserFilters } from '../repositories/admin.repository';
import { buildPaginationMeta } from '../../../common/helpers/pagination.helper';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepo: AdminRepository) {}

  getStats() {
    return this.adminRepo.getStats();
  }

  async listShops(filters: AdminShopFilters) {
    console.log('[AdminService] listShops items');
    const { items, total, page, limit } = await this.adminRepo.findAllShops(filters);
    
    return buildPaginationMeta(items, total, page, limit);
  }

  async getShop(id: string) {
    const shop = await this.adminRepo.findShopById(id);
    if (!shop) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Shop not found' });
    return shop;
  }

  async approveShop(id: string) {
    const shop = await this.adminRepo.findShopById(id);
    if (!shop) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Shop not found' });

    if ((shop as any).status === 'APPROVED') {
      throw new UnprocessableEntityException({ code: 'CONFLICT', message: 'Shop is already approved' });
    }

    return this.adminRepo.updateShopStatus(id, 'APPROVED');
  }

  async suspendShop(id: string) {
    const shop = await this.adminRepo.findShopById(id);
    if (!shop) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Shop not found' });

    if ((shop as any).status === 'SUSPENDED') {
      throw new UnprocessableEntityException({ code: 'CONFLICT', message: 'Shop is already suspended' });
    }

    return this.adminRepo.updateShopStatus(id, 'SUSPENDED');
  }

  async listUsers(filters: AdminUserFilters) {
    const { items, total, page, limit } = await this.adminRepo.findAllUsers(filters);
    return buildPaginationMeta(items, total, page, limit);
  }

  async getUser(id: string) {
    const user = await this.adminRepo.findUserById(id);
    if (!user) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'User not found' });
    return user;
  }

  async deactivateUser(id: string) {
    const user = await this.adminRepo.findUserById(id);
    if (!user) throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'User not found' });
    return this.adminRepo.deactivateUser(id);
  }
}
