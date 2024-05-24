import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { compare } from "bcryptjs";
import { jwtSign } from "src/utils/jwt.utils";
import { errorMessage, successMessage } from "src/constants/messages";
import { AdminModel } from "./admin.model";
import { CreateUserDto } from "../user/user.dto";
import { CreateAdminDto, LoginAdminDto } from "./admin.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminModel)
    private adminModel: ReturnModelType<typeof AdminModel>,
  ) {}

  async createAdmin(payload: CreateAdminDto) {
    const { email, contactNo } = payload;

    const [emailExist, contactNoExist] = await Promise.all([
      this.adminModel.exists({ email, isDeleted: { $ne: true } }),
      this.adminModel.exists({ contactNo, isDeleted: { $ne: true } }),
    ]);

    if (emailExist) {
      throw new BadRequestException(errorMessage.emailAlreadyExist);
    }

    if (contactNoExist) {
      throw new BadRequestException(errorMessage.contactNoAlreadyExist);
    }

    const data = await this.adminModel.create(payload);

    return data.toJSON();
  }

  async loginAdmin({ email, password }: LoginAdminDto) {
    const admin = await this.adminModel
      .findOne({
        email,
        isDeleted: { $ne: true },
      })
      .lean();

    if (!admin) {
      throw new BadRequestException(errorMessage.incorrectCredential);
    }

    const { password: _password, _id: adminId, role, ...rest } = admin;

    const matchPassword = await compare(password, _password);

    if (!matchPassword) {
      throw new BadRequestException(errorMessage.incorrectCredential);
    }

    const token = jwtSign({
      id: `${adminId}`,
      role,
    });

    return {
      ...rest,
      token,
    };
  }

  async allAdmin() {
    return this.adminModel.find({ isDeleted: { $ne: true } });
  }

  async updateAdmin(id: string, reqBody: CreateUserDto) {
    const admin = await this.adminModel.findByIdAndUpdate(id, reqBody, {
      lean: true,
      new: true,
      projection: { password: 0 },
    });

    if (!admin) {
      throw new NotFoundException(errorMessage.userNotExist);
    }

    return admin;
  }

  async deleteAdmin(id: string) {
    const admin = await this.adminModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { lean: true, new: true },
    );

    if (!admin) {
      throw new NotFoundException(errorMessage.userNotExist);
    }

    return successMessage.userDelete;
  }
}
