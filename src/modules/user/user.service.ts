import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UsersModel } from "./user.model";
import { ReturnModelType } from "@typegoose/typegoose";
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
      this.usersModel.exists({ email, isDeleted: { $ne: true } }),
      this.usersModel.exists({ contactNo, isDeleted: { $ne: true } }),
    ]);

    if (emailExist) {
      throw new BadRequestException(errorMessage.emailAlreadyExist);
    }

    if (contactNoExist) {
      throw new BadRequestException(errorMessage.contactNoAlreadyExist);
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

    const { password: _password, _id: userId, role, ...rest } = user;

    const matchPassword = await compare(password, _password);

    if (!matchPassword) {
      throw new BadRequestException(errorMessage.incorrectCredential);
    }

    const token = jwtSign({
      id: `${userId}`,
      role,
    });

    return {
      ...rest,
      token,
    };
  }

  async allUsers() {
    return this.usersModel.find({ isDeleted: { $ne: true } });
  }

  async updateUser(id: string, reqBody: CreateUserDto) {
    const user = await this.usersModel.findByIdAndUpdate(id, reqBody, {
      lean: true,
      new: true,
      projection: { password: 0 },
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
