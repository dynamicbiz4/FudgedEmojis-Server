import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateRequestDto {

    @IsNotEmpty()
    status: number;

    @IsNotEmpty()
    id: string;

    @IsOptional()
    approvedDate: Date;
   
}
