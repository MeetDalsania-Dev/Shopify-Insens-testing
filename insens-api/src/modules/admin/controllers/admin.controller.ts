import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { Roles }        from '../../../core/decorators/roles.decorator';
import { RolesGuard }   from '../../../core/guards/roles.guard';
import { UserRole }     from '../../../common/constants/roles.constant';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // ── Vendors ───────────────────────────────────────────────────────────────

  @Get('vendors')
  listVendors(
    @Query('status') status?: string,
    @Query('page')   page?:   number,
    @Query('limit')  limit?:  number,
  ) {
    return this.adminService.listVendors({ status, page, limit });
  }

  @Get('vendors/:id')
  getVendor(@Param('id') id: string) {
    return this.adminService.getVendor(id);
  }

  @Patch('vendors/:id/approve')
  @HttpCode(HttpStatus.OK)
  approveVendor(@Param('id') id: string) {
    return this.adminService.approveVendor(id);
  }

  @Patch('vendors/:id/suspend')
  @HttpCode(HttpStatus.OK)
  suspendVendor(@Param('id') id: string) {
    return this.adminService.suspendVendor(id);
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  @Get('users')
  listUsers(
    @Query('page')  page?:  number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listUsers({ page, limit });
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }
}
