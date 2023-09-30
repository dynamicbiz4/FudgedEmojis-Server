import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from 'src/schema/requests.schema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateSpinDto } from './dto/update-sppin.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateRequestDto, file: Express.Multer.File) {
    const existReceipt = await this.requestModel.findOne({
      receiptNo: dto.receiptNo,
    });

    if (existReceipt) {
      throw new ConflictException('Receipt number already exits');
    }

    let imageUrl = null;
    if (file) {
      const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);
      imageUrl = cloudinaryResponse.secure_url;
    }

    const { spinBy, ...formData } = dto;

    const requestData = {
      ...formData,
      imgUrl: imageUrl,
      voucherCode: '',
      remarks: '',
      mailSent: false,
      spinnerResult: 0,
      voucherType: '',
      status: 0,
      spinBy: spinBy,
    };
    const newRequest = new this.requestModel(requestData);
    const createdRequest = await newRequest.save();

    if (!createdRequest) {
      throw new Error('Request not Created');
    }

    return { message: 'Request Created Successfully' };
  }

  async findAll() {
    const allRequests = await this.requestModel
      .find({ status: 0 })
      .sort({ createdAt: -1 })
      .exec();

    return allRequests;
  }

  // reviewed for spin requests
  async getAllForSpin(email: string) {
    const query: any = { status: { $in: [0, 1] } };
    if (email) {
      query.createdUser  = email;
    }
    
    const allForSpin = await this.requestModel.find(query).exec();
   
    return allForSpin;
  }

  // reviewed for spin requests
  async getAllAcceptedToSpin() {
    const query = { status: 1 };

    const allReadyForSpin = await this.requestModel.find(query).exec();
    return allReadyForSpin;
  }

  // after  spin requests
  async getAllAfterSpin() {
    const query = { status: 4 };

    const allAfterSpin = await this.requestModel.find(query).exec();
    return allAfterSpin;
  }

  async findOne(id: string) {
    const filter = { _id: id };
    const request = await this.requestModel.findOne(filter).exec();
    if (!request) {
      throw new NotFoundException(`request with ID ${id} not found.`);
    }

    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    const updatedRequest = await this.requestModel
      .updateOne({ _id: id }, { $set: updateRequestDto })
      .exec();

    if (updatedRequest.modifiedCount !== 1) {
      throw new BadRequestException('Update failed!');
    }

    return { message: 'Request update successfully' };
  }

  // add spinner value
  async spinnerResult(id: string, dto: UpdateSpinDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedRequest = await this.requestModel
      .updateOne(
        { _id: id },
        {
          $set: {
            spinnerResult: dto.spinnerResult,
            voucherType: dto.voucherType,
            status: 4,
          },
        },
      )
      .exec();

    if (updatedRequest.modifiedCount !== 1) {
      throw new BadRequestException('Update failed!');
    }
    return { message: 'Spin result saved successfully' };
  }

  // request with spinner value
  async getAllRequestWithSpinner() {
    const query = { spinnerResult: { $ne: null } };

    const allRequestsWithSpinner = await this.requestModel.find(query).exec();
    return allRequestsWithSpinner;
  }

  // requests without spinner value
  async getAllRequestWithoutSpinner() {
    const query = { $or: [{ spinnerResult: null }, { spinnerResult: '' }] };

    const allRequests = await this.requestModel.find(query).exec();
    return allRequests;
  }

  // all completed requests
  async getAllCompletedRequests() {
    const allCompleted = await this.requestModel.find({ status: 5 }).exec();
    return allCompleted;
  }

  // all rejected requests
  async getAllRejectedRequests() {
    const allRejected = await this.requestModel.find({ status: 9 }).exec();
    return allRejected;
  }
}
