import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Cron, CronExpression } from '@nestjs/schedule';
import { filter, firstValueFrom, from, map, mergeMap, timeout } from 'rxjs';
import { GetCategoryListForVendorRequest } from 'src/product-grpc/interface/GetCategoryListForVendorRequest';
import { GetCategoryListForVendorResponse } from 'src/product-grpc/interface/GetCategoryListForVendorResponse';
import { buffer } from 'stream/consumers';
import { BrandsService } from '../brands/brands.service';
import { GetVendorInfoResponse } from '../brands/interfaces/getVendorInfoResponse.interface';
import { CategoriesService } from '../categories/categories.service';
import { defaultCurrency, pipeTimeout } from '../constants';
import { DiscountsService } from '../discounts/discounts.service';
import { ReturnProductsDiscountsResponse } from '../discounts/interfaces/response';
import { ReturnProductsDiscountsRequest } from '../discounts/interfaces/resquest';
import { ExchangeService } from '../exchange-rates/exchange-rates.service';
import { FilesService } from '../files/files.service';
import { GetAllForOwnerResponse } from '../files/interfaces/getAllForOwnerResponse';
import { MessagingService } from '../messaging/messaging.service';
import { getProductByIdRequest } from '../product-grpc/interface/request';
import { getProductByIdResponse } from '../product-grpc/interface/response';
import { FilterProductDto } from '../products/dto/filter-product.dto';
import { getCountAndRatingForTargetResponse } from '../reviews/getCountAndRatingForTargetResponse';
import { ReviewsService } from '../reviews/reviews.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsFilter } from './interface/productFilter.Response';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoryService: CategoriesService,
    private readonly brandService: BrandsService,
    private readonly reviewsService: ReviewsService,
    private readonly messagingService: MessagingService,
    private readonly filesService: FilesService,
    private readonly discountService: DiscountsService,
    private readonly exchangeService: ExchangeService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  checkProductsCurrency() {
    from(this.productsService.getNonUsdProduct())
      .pipe(
        filter((products) => !!products.length),
        mergeMap((products) => {
          return from(products).pipe(
            mergeMap((p) =>
              from(this.getPrice(p.unit, defaultCurrency, p.price)).pipe(
                map((curr) =>
                  from(
                    this.updateProduct({
                      id: p.id,
                      price: curr.amount,
                      unit: curr.unit,
                    }),
                  ),
                ),
              ),
            ),
          );
        }),
      )
      .subscribe();
  }

  @Get('fill')
  async autoComplete(@Query('q') q: string) {
    if (q.trim() === '') return [];
    const products = await this.productsService.autoCompleteName(q);
    return products;
  }

  async convertCurrencyPriceLimit(
    price: {
      gt;
      lt;
    },
    unit: string,
  ): Promise<{ gt: any; lt: any }> {
    let gt = null,
      lt = null;

    if (price.gt) {
      const { amount } = await this.getPrice(unit, defaultCurrency, price.gt);
      gt = amount;
    }

    if (price.lt) {
      const { amount } = await this.getPrice(unit, defaultCurrency, price.lt);
      lt = amount;
    }

    return { gt, lt };
  }

  @Get()
  async productSearch(@Query() filterProductDto: FilterProductDto) {
    const defaultOptions = new FilterProductDto();
    const dtoData = { ...defaultOptions, ...filterProductDto };
    dtoData.price = await this.convertCurrencyPriceLimit(
      dtoData.price,
      dtoData.unit,
    );
    const products = await this.productsService.productSearch(dtoData);
    let { data, meta } = products;
    if (!meta?.maxPrice) {
      return {
        ...products,
        meta: { maxPrice: 0 },
      };
    } else {
      const { amount } = await this.getPrice(
        defaultCurrency,
        dtoData.unit,
        meta.maxPrice,
      );
      meta.maxPrice = amount;
    }
    data = await this.mapOtherServiceToProducts(data, dtoData.unit);
    return products;
  }

  @Get('short')
  async getShortProducts(@Body() productIds: string[]) {
    return await this.productsService.getShortProducts(productIds);
  }

  @Get(':id')
  async getProductById(
    @Param('id') id: string,
    @Query('unit') unit: string = defaultCurrency,
  ) {
    console.log(unit);
    const product = await this.productsService.getProductById(id);
    if (!product?.id) throw new NotFoundException();

    const price = await this.getPrice(
      product.price.unit,
      unit,
      product.price.amount,
    );
    const { files } = await this.getImages(product.id);
    const vendor = await this.getBrand(product.brandId);

    const { response } = await this.getDiscounts({
      targets: [
        {
          id: product.id,
          price: product.price.amount,
          unit: product.price.unit,
        },
      ],
    });
    if (!response.length || response[0].percentage == 0) {
      product.discount = null;
    } else {
      if (product.price.unit !== unit) {
        let { amount } = await this.getPrice(
          product.price.unit,
          unit,
          response[0].modifiedPrice,
        );
        response[0].modifiedPrice = amount;
      }

      product.discount = response[0];
    }
    product.images = files;
    product.price = price;
    product.vendor = vendor;
    delete product.brandId;
    return product;
  }

  @Patch('adjustment')
  async adjustProductStock(
    @Body() items: [{ productId: string; quantity: number }],
  ) {
    const respond = await this.productsService.adjustProductStock(items);
    return respond;
  }

  @Patch()
  async updateProduct(@Body() updateProductDto: UpdateProductDto) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  async registerProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
    },
  ) {
    const curr = await this.getPrice(
      createProductDto.unit,
      defaultCurrency,
      createProductDto.price,
    );

    await this.categoryService.getCategoryById(createProductDto.categoryId);

    const product = await this.productsService.addProduct({
      ...createProductDto,
      price: curr.amount,
      unit: curr.unit,
    });

    const category = await this.categoryService.addProductToCategory(
      product.id,
      createProductDto.categoryId,
    );

    this.messagingService.saveFiles(product.id, files.files);
    // const filesParam = this.mapFile(files.files);
  }

  mapFile(filesParam: Express.Multer.File[]) {
    return filesParam.map((file) => ({
      filename: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
    }));
  }
  private async getImages(productId: string): Promise<GetAllForOwnerResponse> {
    try {
      const { files } = await firstValueFrom(
        this.filesService
          .getAllForOwner({ ownerId: productId })
          .pipe(timeout(pipeTimeout)),
      );

      if (!files) return { files: [] };
      return { files };
    } catch (error) {
      console.error('FILE SERVICE ERROR: ', error.message);
      return { files: [] };
    }
  }
  private async getBrand(brandId: string): Promise<GetVendorInfoResponse> {
    try {
      const res = await firstValueFrom(
        this.brandService
          .getNameAndLogoUrl({ id: brandId })
          .pipe(timeout(pipeTimeout)),
      );
      return res;
    } catch (error) {
      console.error('VENDOR SERVICE ERROR:', error.message);
      return {
        id: brandId,
        name: '',
        logoUrl: '',
        slug: '',
      };
    }
  }
  private async returnError(error: any) {
    if (error) {
      console.error(error);
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  private async getReviews(
    targetIds: string,
  ): Promise<getCountAndRatingForTargetResponse> {
    try {
      return await firstValueFrom(
        this.reviewsService.getCountAndRatingForTarget({ targetIds }),
      );
    } catch (error) {
      console.error('REVIEW SERVICE ERROR: ', error.message);
      const response = [{ numberOfReviews: 0, rating: 0, productId: '' }];
      return { response };
    }
  }

  private async getPrice(
    base: string,
    destination: string,
    amount: number,
  ): Promise<{ unit: string; amount: number }> {
    try {
      if (base === destination)
        return {
          unit: base,
          amount,
        };
      const amountResponse = await firstValueFrom(
        this.exchangeService.getAmount({ base, destination, amount }),
      );
      return {
        unit: destination,
        amount: +amountResponse.amount.toFixed(2),
      };
    } catch (error) {
      console.error('CURRENCY SERVICE ERROR:', error.message);
      return {
        unit: base,
        amount: amount,
      };
    }
  }

  private async getDiscounts(
    data: ReturnProductsDiscountsRequest,
  ): Promise<ReturnProductsDiscountsResponse> {
    try {
      return await firstValueFrom(
        this.discountService.returnProductsDiscounts(data),
      );
    } catch (error) {
      console.error('DISCOUNT SERVICE ERROR', error.message);
      return { response: [] };
    }
  }
  private async mapOtherServiceToProducts(
    products: any[],
    destination: string,
  ): Promise<ProductsFilter[]> {
    const reviews = await this.getReviews(
      [...new Set<string>(products.map((p) => p.id))].join(','),
    );
    const targets = products.map((p) => {
      return {
        id: p.id,
        price: p.price.amount,
        unit: p.price.unit,
      };
    });
    const discounts = await this.getDiscounts({ targets });

    return Promise.all<ProductsFilter>(
      products.map(async (p) => {
        //Set image
        const { files } = await this.getImages(p.id);
        p.images = files;

        //Set brand
        const brand = await this.getBrand(p.brandId);
        p.vendor = brand;
        delete p.brandId;

        //Set review
        const reviewFilter = reviews.response.find((r) => r.productId === p.id);
        if (!reviewFilter) {
          p.review = {
            numberOfReviews: 0,
            rating: 0,
          };
        } else {
          p.review = {
            numberOfReviews: reviewFilter.numberOfReviews,
            rating: reviewFilter.rating,
          };
        }

        //Set discount
        const discountFilter = discounts.response.find(
          (d) => d.productId === p.id,
        );
        if (!discountFilter || discountFilter.percentage === 0) {
          p.discount = null;
        } else {
          if (p.price.unit !== destination) {
            let { amount } = await this.getPrice(
              p.price.unit,
              destination,
              discountFilter.modifiedPrice,
            );
            discountFilter.modifiedPrice = amount;
          }
          p.discount = discountFilter;
        }

        //Set price
        const price = await this.getPrice(
          p.price.unit,
          destination,
          p.price.amount,
        );
        p.price = price;
        return p;
      }),
    );
  }

  @GrpcMethod('ProductsService', 'GetProductById')
  async getProductByIdGrpc(
    data: getProductByIdRequest,
  ): Promise<getProductByIdResponse> {
    let imageUrl: string = '';
    try {
      const { id, name, images } = await this.getProductById(data.id, 'VND');
      if (!!images.length) imageUrl = images[0].url;
      return {
        id,
        name,
        imageUrl,
      };
    } catch (error) {
      return { id: '', name: '', imageUrl: '' };
    }
  }

  @GrpcMethod('ProductsService', 'GetCategoryListForVendor')
  async getCategoryListForVendor(
    data: GetCategoryListForVendorRequest,
  ): Promise<GetCategoryListForVendorResponse> {
    const categories = await this.productsService.getCategoryListForVendor(
      data.vendorId,
    );
    return { categories };
  }
}
