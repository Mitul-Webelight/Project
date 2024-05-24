import { Module } from "@nestjs/common";
import { UsersController } from "./user.controller";
import { UsersService } from "./user.service";
import { TypegooseModule } from "nestjs-typegoose";
import { UsersModel } from "./user.model";
import { AdminModel } from "src/modules/admin/admin.model";

@Module({
  imports: [TypegooseModule.forFeature([UsersModel, AdminModel])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
