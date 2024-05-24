import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import responseUtils from "src/utils/response.utils";
import { setAuthToken } from "src/utils/cookie.utils";
import { CookieName } from "src/constants/enum";
import { CurrentUser } from "src/decorators/currentUser";
import { ApiSwaggerResponse, ApiTagsAndBearer } from "src/decorators/swagger";
import { MessageResponse } from "src/decorators/swagger.dto";
import { AdminAuthGuard } from "src/guards/admin.guard";
import { AdminModel } from "./admin.model";
import { AdminService } from "./admin.service";
import { CreateAdminDto, LoginAdminDto } from "./admin.dto";

@ApiTagsAndBearer("Admin")
@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiSwaggerResponse(CreateAdminDto, {
    status: HttpStatus.CREATED,
  })
  @Post()
  async createAdmin(@Res() res: Response, @Body() payload: CreateAdminDto) {
    try {
      const { password: _password, ...data } =
        await this.adminService.createAdmin(payload);

      return responseUtils.success(res, { data, status: HttpStatus.CREATED });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(LoginAdminDto, {
    status: HttpStatus.OK,
  })
  @Post("login")
  async adminLogin(@Res() res: Response, @Body() loginDto: LoginAdminDto) {
    try {
      const { token, ...data } = await this.adminService.loginAdmin(loginDto);

      setAuthToken({
        name: CookieName.adminToken,
        res,
        data: token,
      });

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(CreateAdminDto, {
    status: HttpStatus.OK,
  })
  @UseGuards(AdminAuthGuard)
  @Get()
  async getAdmin(@Res() res: Response, @CurrentUser() user: AdminModel) {
    try {
      const data = user;

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(CreateAdminDto, {
    status: HttpStatus.OK,
  })
  @UseGuards(AdminAuthGuard)
  @Get()
  async getAllUser(@Res() res: Response) {
    try {
      const data = await this.adminService.allAdmin();

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(CreateAdminDto, {
    status: HttpStatus.OK,
  })
  @UseGuards(AdminAuthGuard)
  @Put()
  async updateAdmin(
    @Res() res: Response,
    @CurrentUser() { _id }: RequestUser,
    @Body() reqBody: CreateAdminDto,
  ) {
    try {
      const data = await this.adminService.updateAdmin(_id, reqBody);

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse, {
    status: HttpStatus.OK,
  })
  @UseGuards(AdminAuthGuard)
  @Delete()
  async deleteAdmin(@Res() res: Response, @CurrentUser() { _id }: RequestUser) {
    try {
      const data = await this.adminService.deleteAdmin(_id);

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
