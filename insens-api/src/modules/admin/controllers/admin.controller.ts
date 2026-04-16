import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get platform statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'Platform stats: total vendors, users, products' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  getStats() {
    return this.adminService.getStats();
  }

  // ── Vendors ───────────────────────────────────────────────────────────────

  @Get('vendors')
  @ApiOperation({ summary: 'List all vendors (admin only)' })
  @ApiQuery({ name: 'approvalStatus', required: false, enum: ['pending_review', 'approved', 'rejected', 'waiting'], description: 'Filter by approval status (requests page)' })
  @ApiQuery({ name: 'status',  required: false, enum: ['pending', 'active', 'suspended', 'rejected'], description: 'Filter by vendor status' })
  @ApiQuery({ name: 'page',    required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit',   required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated list of vendors with owner info' })
  @ApiResponse({ status: 403, description: 'Forbidden — admin role required' })
  listVendors(
    @Query('approvalStatus') approvalStatus?: string,
    @Query('status')         status?:         string,
    @Query('page')           page?:           number,
    @Query('limit')          limit?:          number,
  ) {
    return this.adminService.listVendors({ approvalStatus, status, page, limit });
  }

  @Get('vendors/:id')
  @ApiOperation({ summary: 'Get vendor by ID with owner info (admin only)' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ status: 200, description: 'Vendor details with owner' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  getVendor(@Param('id') id: string) {
    return this.adminService.getVendor(id);
  }

  @Patch('vendors/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a vendor (admin only)', description: 'Sets approvalStatus → approved, status → active' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ status: 200, description: 'Vendor approved — status set to active' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  approveVendor(@Param('id') id: string) {
    return this.adminService.approveVendor(id);
  }

  @Patch('vendors/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a vendor application (admin only)', description: 'Sets approvalStatus → rejected, status → rejected' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ status: 200, description: 'Vendor application rejected' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  rejectVendor(@Param('id') id: string) {
    return this.adminService.rejectVendor(id);
  }

  @Patch('vendors/:id/waiting')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Put vendor application on hold (admin only)', description: 'Sets approvalStatus → waiting — requires more information before review' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ status: 200, description: 'Vendor application set to waiting' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  setWaitingVendor(@Param('id') id: string) {
    return this.adminService.setWaitingVendor(id);
  }

  @Patch('vendors/:id/suspend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suspend a vendor (admin only)', description: 'Sets status → suspended' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ status: 200, description: 'Vendor suspended' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  suspendVendor(@Param('id') id: string) {
    return this.adminService.suspendVendor(id);
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiQuery({ name: 'page',  required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  listUsers(
    @Query('page')  page?:  number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listUsers({ page, limit });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a user account (admin only)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deactivated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }
}
