import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VendorsService }    from '../services/vendors.service';
import { CreateVendorDto }   from '../dtos/create-vendor.dto';
import { UpdateVendorDto }   from '../dtos/update-vendor.dto';
import { VendorFiltersDto }  from '../dtos/vendor-filters.dto';
import { Public }            from '../../../core/decorators/public.decorator';
import { CurrentUser }       from '../../../core/decorators/current-user.decorator';
import { JwtAuthGuard }      from '../../../core/guards/jwt-auth.guard';
import type { JwtPayload }        from '../../../common/interfaces/jwt-payload.interface';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  /** Create a new vendor — authenticated users only */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() dto: CreateVendorDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.vendorsService.create(dto, user);
  }

  /** List vendors — public */
  @Get()
  @Public()
  findAll(@Query() filters: VendorFiltersDto) {
    return this.vendorsService.findAll(filters);
  }

  /** Get vendor by ID — public */
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  /** Update vendor — owner only */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(id, dto);
  }
}
