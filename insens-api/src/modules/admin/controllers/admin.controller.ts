import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags }    from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { Roles }        from '../../../core/decorators/roles.decorator';
import { RolesGuard }   from '../../../core/guards/roles.guard';
import { UserRole }     from '../../../common/constants/roles.constant';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.INSENS_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  // ── Shops ─────────────────────────────────────────────────────────────────

  @Get('shops')
  listShops(
    @Query('status') status?: string,
    @Query('page')   page?:   number,
    @Query('limit')  limit?:  number,
  ) {
    
    return this.adminService.listShops({ status, page, limit });
  }

  @Get('shops/:id')
  getShop(@Param('id') id: string) {
    return this.adminService.getShop(id);
  }

  @Patch('shops/:id/approve')
  @HttpCode(HttpStatus.OK)
  approveShop(@Param('id') id: string) {
    return this.adminService.approveShop(id);
  }

  @Patch('shops/:id/suspend')
  @HttpCode(HttpStatus.OK)
  suspendShop(@Param('id') id: string) {
    return this.adminService.suspendShop(id);
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
