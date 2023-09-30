import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type EmailDocument = Email & Document;

@Schema({timestamps: true})

export class Email {
    @Prop()
    voucherCode: string;

    @Prop()
    remarks: string;

    

}

export const EmailSchema = SchemaFactory.createForClass(Email);

