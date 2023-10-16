import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Put,
  UseGuards,
  UploadedFile,
  Request,
  Query,
  Headers
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateSpinDto } from './dto/update-sppin.dto';
import { MailService } from 'src/mail/mail.service';
import { RolesGuard } from 'src/config/guards/role.guard';
import { Roles } from 'src/config/guards/roles.decorator';
import { UserRole } from 'src/config/guards/roles.enum';

@Controller('request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('imgFile'))
  async create(
    @Body() dto: CreateRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.requestService.create(dto, file);
    return result;
  }

   @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll() {
    return await this.requestService.findAll();
  }
  
  @UseGuards(JwtAuthGuard)
 @Get('spinning')
 async getAllForSpin(@Query('email') email: string) {
  return this.requestService.getAllForSpin(email);
}

  @UseGuards(JwtAuthGuard)
  @Get('waiting')
  async getAllAcceptedToSpin(){
    return await this.requestService.getAllAcceptedToSpin();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles(UserRole.ADMIN)
  @Get('after-spin')
  async getAllAfterSpin(){
    return await this.requestService.getAllAfterSpin();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.requestService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('addresult/:id')
  spinnerResult(@Param('id') id: string, @Body() dto: UpdateSpinDto) {
    return this.requestService.spinnerResult(id, dto);
  }

  // @Delete('remove/:id')
  // remove(@Param('id') id: string) {
  //   return this.requestService.remove(+id);
  // }
  @UseGuards(JwtAuthGuard)
  @Get('spinner')
  getAllRequestWithSpinner() {
    return this.requestService.getAllRequestWithSpinner();
  }

  @UseGuards(JwtAuthGuard)
  @Get('no-spinner')
  getAllRequestWithoutSpinner() {
    return this.requestService.getAllRequestWithoutSpinner();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('completed')
  getAllCompletedRequests() {
    return this.requestService.getAllCompletedRequests();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('rejected')
  getAllRejectedRequests() {
    return this.requestService.getAllRejectedRequests();
  }

  //email
  @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles(UserRole.ADMIN)
  @Post('email/:id')
  async getEmail(@Body() emailData: any,@Headers() headers: any) {
    try {
      await this.mailService.sendMail(emailData);
      return { message: 'Email sent successfully' };

    } catch (error) {

      return { error: error.message || 'Failed to send email' };
    }
  }

  // file upload
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('imgFile'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }
}
