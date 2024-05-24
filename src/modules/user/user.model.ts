import { index, modelOptions, pre, prop } from "@typegoose/typegoose";
import { hash } from "bcryptjs";
import { Role } from "src/constants/enum";

@pre<UsersModel>("save", async function (next) {
  try {
    this.password = await hash(this.password, 4);
    next();
  } catch (error) {
    next(error);
  }
})
@modelOptions({
  schemaOptions: { timestamps: true, versionKey: false, collection: "users" },
})
@index({ contactNo: 1, email: 1 }, { unique: true })
export class UsersModel {
  @prop()
  firstName: string;

  @prop()
  lastName: string;

  @prop()
  contactNo: string;

  @prop({ lowercase: true, trim: true })
  email: string;

  @prop()
  password: string;

  @prop({ type: Number, enum: Role, default: Role.User })
  role!: Role;

  @prop({ default: false })
  isDeleted!: boolean;
}
