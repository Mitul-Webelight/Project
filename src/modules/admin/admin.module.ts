import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { AdminModel } from "src/modules/admin/admin.model";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [TypegooseModule.forFeature([AdminModel])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
