import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateRequestDto {

    @IsNotEmpty()
    receiptNo: string;

    @IsNotEmpty()
    orderPrice: number;

    @IsOptional()
    imgUrl: string;

    @IsOptional()
    spinnerResult: number;

    @IsNotEmpty()
    spinBy: string;

    @IsOptional()
    voucherType: string;

    @IsNotEmpty()
    createdUser: string;

    @IsOptional()
    approvedDate: Date;
}
