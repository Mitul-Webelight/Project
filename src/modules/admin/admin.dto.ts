import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from "class-validator";
import { errorMessage } from "src/constants/messages";

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactNo: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: errorMessage.strongPasswordValidation },
  )
  password: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsNotEmpty()
  isDeleted?: boolean;
}

export class LoginAdminDto {
  @ApiProperty()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
