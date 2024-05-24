import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { ExceptionErrorDTO, PaginatedDto, ResponseDTO } from "./swagger.dto";
import { ResponseDTOTypeEnum } from "src/constants/enum";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { successMessage } from "src/constants/messages";

interface ApiSwaggerOption {
  status?: number;
  type?: ResponseDTOTypeEnum;
  pagination?: boolean;
}

const getExceptionSchema = (httpStatus: number) => {
  return {
    allOf: [
      {
        $ref: getSchemaPath(ExceptionErrorDTO),
      },
      {
        properties: {
          statusCode: {
            example: httpStatus,
          },
        },
      },
    ],
  };
};

export function ApiTagsAndBearer(...tags: string[]) {
  return applyDecorators(ApiBearerAuth(), ApiTags(...tags));
}

export function ApiSwaggerResponse<TModel extends Type>(
  model: TModel,
  options?: ApiSwaggerOption,
) {
  const {
    status = StatusCodes.OK,
    type = ResponseDTOTypeEnum.Object,
    pagination = false,
  } = options ?? {};

  return applyDecorators(
    ApiExtraModels(ResponseDTO),
    ApiExtraModels(PaginatedDto),
    ApiExtraModels(model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            $ref: pagination
              ? getSchemaPath(PaginatedDto)
              : getSchemaPath(ResponseDTO),
          },
          {
            properties: {
              data:
                type === ResponseDTOTypeEnum.Array
                  ? {
                      type,
                      items: { $ref: getSchemaPath(model) },
                    }
                  : {
                      $ref: getSchemaPath(model),
                    },
              status: {
                example: status,
              },
            },
          },
        ],
      },
      description:
        status === StatusCodes.CREATED
          ? successMessage.created
          : successMessage.success,
    }),

    // exception error response
    ApiExtraModels(ExceptionErrorDTO),
    ApiUnauthorizedResponse({
      schema: getExceptionSchema(StatusCodes.UNAUTHORIZED),
      description: `${StatusCodes.UNAUTHORIZED}. ${getReasonPhrase(StatusCodes.UNAUTHORIZED)}`,
    }),

    ApiForbiddenResponse({
      schema: getExceptionSchema(StatusCodes.FORBIDDEN),
      description: `${StatusCodes.FORBIDDEN}. ${getReasonPhrase(StatusCodes.FORBIDDEN)}`,
    }),

    ApiNotFoundResponse({
      schema: getExceptionSchema(StatusCodes.NOT_FOUND),
      description: `${StatusCodes.NOT_FOUND}. ${getReasonPhrase(StatusCodes.NOT_FOUND)}`,
    }),

    ApiConflictResponse({
      schema: getExceptionSchema(StatusCodes.CONFLICT),
      description: `${StatusCodes.CONFLICT}. ${getReasonPhrase(StatusCodes.CONFLICT)}`,
    }),

    ApiInternalServerErrorResponse({
      schema: getExceptionSchema(StatusCodes.INTERNAL_SERVER_ERROR),
      description: `${StatusCodes.INTERNAL_SERVER_ERROR}. ${getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)}`,
    }),
  );
}
