import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { appConfig } from "src/config/app.config";
import { TypegooseModule } from "nestjs-typegoose";
import { UsersModule } from "src/modules/user/user.module";

@Module({
  imports: [TypegooseModule.forRoot(appConfig.db_Url), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
