import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { VendorsRepository }  from '../repositories/vendors.repository';
import { CreateVendorDto }    from '../dtos/create-vendor.dto';
import { UpdateVendorDto }    from '../dtos/update-vendor.dto';
import { VendorFiltersDto }   from '../dtos/vendor-filters.dto';
import type { JwtPayload }         from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class VendorsService {
  constructor(private readonly vendorsRepo: VendorsRepository) {}

  async create(dto: CreateVendorDto, user: JwtPayload) {
    const existing = await this.vendorsRepo.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException({ code: 'CONFLICT', message: 'A vendor with this slug already exists' });
    }

    const vendor = await this.vendorsRepo.create({
      legalName:      dto.legalName,
      displayName:    dto.displayName,
      slug:           dto.slug,
      email:          dto.email,
      phone:          dto.phone,
      description:    dto.description,
      status:         'pending',
      approvalStatus: 'pending_review',
    });

    // Link the creator as vendor owner and assign platform role
    await this.vendorsRepo.linkUser(vendor.id, user.sub, 'owner');
    await this.vendorsRepo.assignVendorOwnerRole(user.sub);

    return vendor;
  }

  async findAll(filters: VendorFiltersDto) {
    return this.vendorsRepo.findAll({
      status: filters.status,
      page:   filters.page  ?? 1,
      limit:  filters.limit ?? 20,
    });
  }

  async findOne(id: string) {
    const vendor = await this.vendorsRepo.findById(id);
    if (!vendor) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });
    }
    return vendor;
  }

  async update(id: string, dto: UpdateVendorDto) {
    const vendor = await this.vendorsRepo.findById(id);
    if (!vendor) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });
    }

    return this.vendorsRepo.update(id, {
      displayName: dto.displayName,
      email:       dto.email,
      phone:       dto.phone,
      description: dto.description,
      logoUrl:     dto.logoUrl,
      bannerUrl:   dto.bannerUrl,
    });
  }

  async approve(id: string) {
    const vendor = await this.vendorsRepo.findById(id);
    if (!vendor) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });
    }

    return this.vendorsRepo.update(id, {
      approvalStatus: 'approved',
      status:         'active',
      approvedAt:     new Date(),
    });
  }

  async suspend(id: string) {
    const vendor = await this.vendorsRepo.findById(id);
    if (!vendor) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Vendor not found' });
    }

    return this.vendorsRepo.update(id, {
      status:      'suspended',
      suspendedAt: new Date(),
    });
  }
}
