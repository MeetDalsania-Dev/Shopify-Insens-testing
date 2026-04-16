import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository, ProductFilters } from '../repositories/products.repository';
import { CreateProductDto }  from '../dtos/create-product.dto';
import { UpdateProductDto }  from '../dtos/update-product.dto';
import { CreateVariantDto }  from '../dtos/create-variant.dto';
import { UpdateVariantDto }  from '../dtos/update-variant.dto';
import type { JwtPayload }        from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductsRepository) {}

  // ── Products ──────────────────────────────────────────────────────────────

  async createProduct(dto: CreateProductDto, user: JwtPayload) {
    if (!user.vendorId) {
      throw new ForbiddenException({
        code:    'VENDOR_REQUIRED',
        message: 'You must have an approved vendor account to add products',
      });
    }
  
    console.log(dto);
    
    const product = await this.productsRepo.create({
      vendorId:         user.vendorId,
      brandId:          dto.brandId       ?? null,
      categoryId:       dto.categoryId    ?? null,
      title:            dto.title,
      slug:             dto.slug,
      shortDescription: dto.shortDescription ?? null,
      description:      dto.description      ?? null,
      productType:      (dto.productType  ?? 'simple') as any,
      listingType:      dto.listingType   ?? null,
      originCountry:    dto.originCountry ?? null,
      tags:             dto.tags          ?? null,
      productVideo:     dto.productVideo  ?? null,
      view360:          dto.view360       ?? null,
      status:           (dto.status ?? 'draft') as any,
      approvalStatus:   'pending_review',
    });
      console.log(product);
    if (dto.perfumeDetails) {
      await this.productsRepo.createPerfumeDetails({
        productId:                   product.id,
        fragranceFamily:             dto.perfumeDetails.fragranceFamily             ?? null,
        concentration:               (dto.perfumeDetails.concentration as any)      ?? null,
        genderTarget:                (dto.perfumeDetails.genderTarget   as any)     ?? null,
        topNotes:                    dto.perfumeDetails.topNotes                    ?? null,
        middleNotes:                 dto.perfumeDetails.middleNotes                 ?? null,
        baseNotes:                   dto.perfumeDetails.baseNotes                   ?? null,
        occasionTags:                dto.perfumeDetails.occasionTags                ?? null,
        seasonTags:                  dto.perfumeDetails.seasonTags                  ?? null,
        longevityScore:              dto.perfumeDetails.longevityScore              ?? null,
        projectionScore:             dto.perfumeDetails.projectionScore             ?? null,
        scentStory:                  dto.perfumeDetails.scentStory                  ?? null,
        handcrafted:                 dto.perfumeDetails.handcrafted                 ?? false,
        crueltyFree:                 dto.perfumeDetails.crueltyFree                 ?? false,
        launchYear:                  dto.perfumeDetails.launchYear                  ?? null,
        editionName:                 dto.perfumeDetails.editionName                 ?? null,
        discontinued:                dto.perfumeDetails.discontinued                ?? false,
        batchNumber:                 dto.perfumeDetails.batchNumber                 ?? null,
        formulaRef:                  dto.perfumeDetails.formulaRef                  ?? null,
        brandAuthorizationProof:     dto.perfumeDetails.brandAuthorizationProof     ?? null,
        authorizedSellerDeclaration: dto.perfumeDetails.authorizedSellerDeclaration ?? false,
      });
    }

    if (dto.variants?.length) {
      await Promise.all(
        dto.variants.map(v =>
          this.productsRepo.createVariant({
            productId:        product.id,
            sku:              v.sku,
            barcode:          v.barcode          ?? null,
            title:            v.title            ?? null,
            sizeLabel:        v.sizeLabel        ?? null,
            packagingType:    v.packagingType     ?? null,
            editionType:      v.editionType      ?? null,
            currency:         'INR',
            mrp:              v.mrp,
            salePrice:        v.salePrice,
            costPrice:        v.costPrice        ?? null,
            stock:            v.stock            ?? 0,
            reorderThreshold: v.reorderThreshold ?? 0,
            weightGrams:      v.weightGrams      ?? null,
            lengthCm:         v.lengthCm         ?? null,
            widthCm:          v.widthCm          ?? null,
            heightCm:         v.heightCm         ?? null,
            isActive:         v.isActive         ?? true,
          }),
        ),
      );
    }

    return product;
  }

  async listProducts(filters: ProductFilters) {
    const { items, total, page, limit } = await this.productsRepo.findAll(filters);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProduct(id: string) {
    const product = await this.productsRepo.findByIdWithVariants(id);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }
    return product;
  }

  async updateProduct(productId: string, dto: UpdateProductDto, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    return this.productsRepo.update(productId, dto as any);
  }

  // ── Variants ──────────────────────────────────────────────────────────────

  async createVariant(productId: string, dto: CreateVariantDto, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    return this.productsRepo.createVariant({
      productId,
      sku:              dto.sku,
      barcode:          dto.barcode          ?? null,
      title:            dto.title            ?? null,
      sizeLabel:        dto.sizeLabel        ?? null,
      packagingType:    dto.packagingType     ?? null,
      editionType:      dto.editionType      ?? null,
      currency:         'INR',
      mrp:              dto.mrp,
      salePrice:        dto.salePrice,
      costPrice:        dto.costPrice        ?? null,
      stock:            dto.stock            ?? 0,
      reorderThreshold: dto.reorderThreshold ?? 0,
      weightGrams:      dto.weightGrams      ?? null,
      lengthCm:         dto.lengthCm         ?? null,
      widthCm:          dto.widthCm          ?? null,
      heightCm:         dto.heightCm         ?? null,
      isActive:         dto.isActive         ?? true,
    });
  }

  async updateVariant(productId: string, variantId: string, dto: UpdateVariantDto, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    const variant = await this.productsRepo.findVariantById(variantId);
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Variant not found' });
    }

    return this.productsRepo.updateVariant(variantId, dto as any);
  }

  async deleteVariant(productId: string, variantId: string, user: JwtPayload) {
    const product = await this.productsRepo.findById(productId);
    if (!product) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Product not found' });
    }

    if (product.vendorId !== user.vendorId) {
      throw new ForbiddenException({ code: 'OWNERSHIP_VIOLATION', message: 'You do not own this product' });
    }

    await this.productsRepo.deleteVariant(variantId);
    return { message: 'Variant removed successfully' };
  }
}
