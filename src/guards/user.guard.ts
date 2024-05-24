import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Role } from "src/constants/enum";
import { UsersModel } from "src/modules/user/user.model";
import { decodeToken } from "src/utils/jwt.utils";
import { createObjectId } from "src/utils/objectId.utils";

@Injectable()
export class UserAuthGuard {
  constructor(
    @InjectModel(UsersModel)
    private customersModel: ReturnModelType<typeof UsersModel>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    const { userToken } = req.cookies;

    const authToken = authorization || userToken;

    if (!authToken) {
      throw new UnauthorizedException();
    }

    const { id, role } = decodeToken(authToken);

    try {
      if (role === Role.User) {
        const user = await this.customersModel
          .find({ _id: createObjectId(id), isDeleted: { $ne: true } })
          .select("-password -role")
          .limit(1)
          .lean();

        if (!user) {
          throw new UnauthorizedException();
        }

        req.user = {
          ...user,
        };

        return true;
      }

      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
