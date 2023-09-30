    import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
    import { UserDocument } from "./auth/user.schema";
    import { Types } from "mongoose";

    export type RequestDocument = Request & Document;

    @Schema({timestamps: true})

    export class Request {
        @Prop()
        receiptNo: string;

        @Prop()
        orderPrice: number;

        @Prop()
        spinnerResult: number

        @Prop()
        imgUrl: string;
        
        @Prop()
        voucherCode: string;

        @Prop()
        voucherType: string;

        @Prop()
        remarks: string;

        @Prop()
        mailSent: boolean;

        @Prop()
        status: number;
    
        @Prop({type: Types.ObjectId, ref: 'User'})
        spinBy: Types.ObjectId;

        @Prop()
        createdUser: string;

        @Prop()
        approvedDate: Date;
        

    }

    export const RequestSchema = SchemaFactory.createForClass(Request);