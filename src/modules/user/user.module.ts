import { Module } from "@nestjs/common";
import { UsersController } from "./user.controller";
import { UsersService } from "./user.service";
import { TypegooseModule } from "nestjs-typegoose";
import { UsersModel } from "./user.model";

@Module({
  imports: [TypegooseModule.forFeature([UsersModel])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
