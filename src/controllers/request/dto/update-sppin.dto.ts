import {  IsOptional } from "class-validator";

export class UpdateSpinDto {

    @IsOptional()
    spinnerResult: number;

    @IsOptional()
    voucherType: string;


}
