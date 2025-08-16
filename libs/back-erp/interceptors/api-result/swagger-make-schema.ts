import {ApiOkResponse, getSchemaPath} from '@nestjs/swagger'
import {ApiResult} from './api-result.types'
import {applyDecorators, Type} from '@nestjs/common'
import {ListDTO} from '../../services/list-service/list.service.types';

export const ApiResultListDTO = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResult)},
          {
            properties: {
              payload: {
                allOf: [
                  {$ref: getSchemaPath(ListDTO)},
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: {$ref: getSchemaPath(model)},
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  )
}

export const ApiResultDTO = <TModel extends Type<any>>(model: TModel, description = '') => {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResult)},
          {
            properties: {
              payload: {$ref: getSchemaPath(model)},
            },
          },
        ],
      },
    }),
  )
}

export const ApiArrayDTO = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {$ref: getSchemaPath(ApiResult)},
          {
            properties: {
              payload: {
                type: 'array',
                items: {$ref: getSchemaPath(model)},
              },
            },
          },
        ],
      },
    }),
  )
}
