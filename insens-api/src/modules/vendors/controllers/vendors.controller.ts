import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { VendorsService }   from '../services/vendors.service';
import { CreateVendorDto }  from '../dtos/create-vendor.dto';
import { UpdateVendorDto }  from '../dtos/update-vendor.dto';
import { VendorFiltersDto } from '../dtos/vendor-filters.dto';
import { Public }           from '../../../core/decorators/public.decorator';
import { CurrentUser }      from '../../../core/decorators/current-user.decorator';
import { JwtAuthGuard }     from '../../../core/guards/jwt-auth.guard';
import type { JwtPayload }  from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vendor', description: 'Authenticated users only. Vendor starts in pending status awaiting admin approval.' })
  @ApiResponse({ status: 201, description: 'Vendor created — status: pending, approvalStatus: pending_review' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Slug already taken' })
  create(
    @Body() dto: CreateVendorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vendorsService.create(dto, user);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List vendors (public)', description: 'Paginated list with optional status/city filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'active', 'suspended', 'rejected'] })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated list of vendors' })
  findAll(@Query() filters: VendorFiltersDto) {
    return this.vendorsService.findAll(filters);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get vendor by ID (public)' })
  @ApiParam({ name: 'id', description: 'Vendor UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: 'Vendor details' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor details (owner only)' })
  @ApiParam({ name: 'id', description: 'Vendor UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: 'Updated vendor details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(id, dto);
  }
}
