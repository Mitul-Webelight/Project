import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UsersModel } from "./user.model";
import { ReturnModelType, mongoose } from "@typegoose/typegoose";
import { CreateUserDto, LoginUserDto } from "./user.dto";
import { compare } from "bcryptjs";
import { jwtSign } from "src/utils/jwt.utils";
import { errorMessage, successMessage } from "src/constants/messages";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private usersModel: ReturnModelType<typeof UsersModel>,
  ) {}

  async createUser(payload: CreateUserDto) {
    const { email, contactNo } = payload;

    const [emailExist, contactNoExist] = await Promise.all([
      this.usersModel.findOne({ email, isDeleted: { $ne: true } }),
      this.usersModel.findOne({ contactNo, isDeleted: { $ne: true } }),
    ]);

    if (emailExist || contactNoExist) {
      throw new NotFoundException(errorMessage.userNotExist);
    }

    const data = await this.usersModel.create(payload);

    return data.toJSON();
  }

  async loginUser({ email, password }: LoginUserDto) {
    const user = await this.usersModel
      .findOne({
        email,
        isDeleted: { $ne: true },
      })
      .lean();

    if (!user) {
      throw new BadRequestException(errorMessage.incorrectCredential);
    }

    const { password: _password, _id: userId, ...rest } = user;

    const matchPassword = await compare(password, _password);

    if (!matchPassword) {
      throw new BadRequestException(errorMessage.incorrectCredential);
    }

    const token = jwtSign({
      id: `${userId}`,
    });

    return {
      ...rest,
      token,
    };
  }

  async updateUser(id: string, reqBody: CreateUserDto) {
    const user = await this.usersModel.findByIdAndUpdate(id, reqBody, {
      lean: true,
      new: true,
      $projection: { password: 0 },
    });

    if (!user) {
      throw new NotFoundException(errorMessage.userNotExist);
    }

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.usersModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { lean: true, new: true },
    );

    if (!user) {
      throw new NotFoundException(errorMessage.userNotExist);
    }

    return successMessage.userDelete;
  }
}
