import { ApiProperty } from '@nestjs/swagger'
import { FileUploadOptions, ImageMetadataSharp } from '@rka/core-utils'

export class FileUploadResultDTO {
  @ApiProperty( { description: 'Опции запроса загрузки файла на сервер' } )
  requestOptions: FileUploadOptions

  @ApiProperty( {
    description:
      'Путь файла в каталоге ERP, например private/maket/c6/fc/c6fc28913dd4c5a734800e30dd5f2f28.pdf. \
  Вычисляется при загрузке по параметрам destFolder и MD5 загруженного файла \
  ',
  } )
  filePath: string

  @ApiProperty( { description: 'Размер исходного файла в байтах' } )
  size: number

  @ApiProperty( { description: 'Md5 исходного файла' } )
  md5: string

  @ApiProperty( {
    description: 'Оригинальное имя файла из заголовков Multipart',
  } )
  originalName: string

  @ApiProperty( {
    description: 'Для загруженного файла создан PDF. (DOCX, XLSX...)',
  } )
  renderedToPdf: boolean

  @ApiProperty( { description: 'Если загружен PDF - число извлеченных страниц' } )
  pageCount: number

  @ApiProperty( {
    description:
      'ok - thumbs созданы успешно, \
          groups: группы (например ["1000", "600", "400"]),   \
          ext: расширения файлов, по умолчанию ["jpg"]  \
        ',
  } )
  thumbs: {
    ok: boolean;
    groups?: string[];
    ext?: string[];
  }

  @ApiProperty( {
    description:
      'Данные, переданные при загрузке в options.meta. Например: { clientId: "01-00000123" }',
  } )
  meta: any

  @ApiProperty( {
    description: 'Дата время загрузки, например "2024-03-21T07:35:05.549Z"',
  } )
  uploadedAt: Date

  @ApiProperty( { description: '' } )
  originalImageMetadata?: ImageMetadataSharp
}
