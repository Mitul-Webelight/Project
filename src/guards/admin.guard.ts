import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Role } from "src/constants/enum";
import { AdminModel } from "src/modules/admin/admin.model";
import { decodeToken } from "src/utils/jwt.utils";
import { createObjectId } from "src/utils/objectId.utils";

@Injectable()
export class AdminAuthGuard {
  constructor(
    @InjectModel(AdminModel)
    private adminModel: ReturnModelType<typeof AdminModel>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    const { adminToken } = req.cookies;

    const authToken = authorization || adminToken;

    if (!authToken) {
      throw new UnauthorizedException();
    }

    const { id, role } = decodeToken(authToken);

    try {
      if (role === Role.Admin) {
        const [user] = await this.adminModel
          .find({ _id: createObjectId(id), isDeleted: { $ne: true } })
          .select("-password -role")
          .limit(1)
          .lean();

        if (!user) {
          throw new UnauthorizedException();
        }

        req.user = {
          ...user,
          role: user.role,
        };

        return true;
      }

      throw new UnauthorizedException();
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
