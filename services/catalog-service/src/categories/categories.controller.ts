import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { firstValueFrom } from 'rxjs';
import { FilesService } from '../files/files.service';
import { MessagingService } from '../messaging/messaging.service';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create-catalog.dto';
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly filesService: FilesService,
    private readonly messagingService: MessagingService,
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  async registerCategories(
    @Body() createCategoriesDto: CreateCategoriesDto,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
    },
  ) {
    const category = await this.categoriesService.registerCategory(
      createCategoriesDto,
    );
    this.messagingService.saveFiles(category.id, files.files);
    return { ...category, images: [] };
  }

  @Get('name')
  async getNameFilter() {
    return this.categoriesService.getNameFilter();
  }

  @Get()
  async getAllCategories() {
    const [categories, error] = await this.categoriesService.getAllCategories();
    if (!categories.length) return [];

    return this.mapImageToChild(categories);
  }

  async mapImageToChild(categories) {
    return Promise.all(
      categories.map(async (category) => {
        if (category.children?.length !== 0) {
          category.children = await this.mapImageToChild(category.children);
        }
        const images = await this.getImages(category.id);
        return { ...category, images };
      }),
    );
  }

  async getImages(categoryId) {
    let images;
    try {
      images = await firstValueFrom(
        this.filesService.getAllForOwner({ ownerId: categoryId }),
      );
    } catch (error) {
      console.error('FILE SERVICE ERROR: ', error);
      return [];
    }

    if (!images?.files) return [];
    return images.files;
  }

  async returnError(error: any) {
    if (error) {
      console.log(error);
      return error;
    }
  }
}
