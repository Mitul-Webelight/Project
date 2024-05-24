import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./user.service";
import { Response } from "express";
import { CreateUserDto, LoginUserDto } from "./user.dto";
import responseUtils from "src/utils/response.utils";
import { setAuthToken } from "src/utils/cookie.utils";
import { CookieName } from "src/constants/enum";
import { AuthGuard } from "src/guards/auth.guard";
import { CurrentUser } from "src/decorators/currentUser";
import { UsersModel } from "./user.model";
import { ApiSwaggerResponse, ApiTagsAndBearer } from "src/decorators/swagger";
import { MessageResponse } from "src/decorators/swagger.dto";

@ApiTagsAndBearer("Users")
@Controller("user")
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiSwaggerResponse(CreateUserDto, {
    status: HttpStatus.CREATED,
  })
  @Post()
  async createUser(@Res() res: Response, @Body() payload: CreateUserDto) {
    try {
      const { password: _password, ...data } =
        await this.userService.createUser(payload);

      return responseUtils.success(res, { data, status: HttpStatus.CREATED });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(LoginUserDto, {
    status: HttpStatus.OK,
  })
  @Post("login")
  async userLogin(@Res() res: Response, @Body() loginDto: LoginUserDto) {
    try {
      const { token, ...data } = await this.userService.loginUser(loginDto);

      setAuthToken({
        name: CookieName.userToken,
        res,
        data: token,
      });

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(CreateUserDto, {
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Res() res: Response, @CurrentUser() user: UsersModel) {
    try {
      const { password: _password, ...data } = user;

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(CreateUserDto, {
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard)
  @Put()
  async updateUser(
    @Res() res: Response,
    @CurrentUser() { _id }: RequestUser,
    @Body() reqBody: CreateUserDto,
  ) {
    try {
      const data = await this.userService.updateUser(_id, reqBody);

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse, {
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Res() res: Response, @CurrentUser() { _id }: RequestUser) {
    try {
      const data = await this.userService.deleteUser(_id);

      return responseUtils.success(res, { data, status: HttpStatus.OK });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
