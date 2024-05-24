import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

export class ExceptionErrorDTO {
  statusCode: number;
  error: string;
  message: string;
}

export class ResponseDTO<TData = null> {
  @ApiProperty()
  status: number;

  @ApiProperty()
  data: TData;
}

export class PaginatedDto<TData> extends ResponseDTO<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class MessageResponse {
  @ApiResponseProperty()
  message: string;
}
