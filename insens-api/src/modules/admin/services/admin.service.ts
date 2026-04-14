import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository, AdminVendorFilters, AdminUserFilters } from '../repositories/admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepo: AdminRepository) {}

  getStats() {
    return this.adminRepo.getStats();
  }

  // ── Vendors ───────────────────────────────────────────────────────────────

  async listVendors(filters: AdminVendorFilters) {
    const { items, total, page, limit } = await this.adminRepo.findAllVendors(filters);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getVendor(id: string) {
    const vendor = await this.adminRepo.findVendorById(id);
    if (!vendor) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });
    return vendor;
  }

  async approveVendor(id: string) {
    const vendor = await this.adminRepo.findVendorById(id);
    if (!vendor) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });

    return this.adminRepo.updateVendor(id, {
      approvalStatus: 'approved',
      status:         'active',
      approvedAt:     new Date(),
    });
  }

  async suspendVendor(id: string) {
    const vendor = await this.adminRepo.findVendorById(id);
    if (!vendor) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });

    return this.adminRepo.updateVendor(id, {
      status:      'suspended',
      suspendedAt: new Date(),
    });
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async listUsers(filters: AdminUserFilters) {
    const { items, total, page, limit } = await this.adminRepo.findAllUsers(filters);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUser(id: string) {
    const user = await this.adminRepo.findUserById(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND', message: 'User not found' });
    return user;
  }

  async deactivateUser(id: string) {
    const user = await this.adminRepo.findUserById(id);
    if (!user) throw new NotFoundException({ code: 'NOT_FOUND', message: 'User not found' });
    return this.adminRepo.suspendUser(id);
  }
}
