import { Injectable } from '@nestjs/common'
import { FileUtils, getImageMetadataSharp, resizeImageFileToBufferSharp } from '@rka/back-utils'
import {
  ConvertFromPdfOptions,
  ConvertFromPdfTargetFileFormat,
  DEFAULT_FILE_UPLOAD_OPTIONS,
  DEFAULT_FILE_UPLOAD_OPTIONS_FORMAT,
} from '@rka/core-utils'
import { fromPath } from 'pdf2pic'
import { WriteImageResponse } from 'pdf2pic/dist/types/convertResponse'

export const ORIG_SUFFIX = '-orig'

export interface ConvertPdfResult {
  convertResults: WriteImageResponse[][];
  fileFormats: ConvertFromPdfTargetFileFormat[];
  pageCount: number;
}

@Injectable()
export class ConvertPdfService {
  async convertPdf(
    pdfFilePath: string,
    destFolder: string,
    targetFileSuffix: string,
    pdfOptions?: ConvertFromPdfOptions,
  ): Promise<ConvertPdfResult> {
    const res: WriteImageResponse[][] = []

    const def = DEFAULT_FILE_UPLOAD_OPTIONS.convertFromPdfOptions
    const options = {
      density: pdfOptions?.density ?? def.density,
      saveFilename: targetFileSuffix + ORIG_SUFFIX,
      savePath: destFolder,
      //format: "jpg",
      width: pdfOptions?.width ?? def.width,
      height: pdfOptions?.height ?? def.height,
      preserveAspectRatio:
        pdfOptions?.preserveAspectRatio ?? def.preserveAspectRatio,
      quality: pdfOptions?.quality || def.quality,
      resizeThreshold: pdfOptions?.resizeThreshold ?? def.resizeThreshold,
      fit: pdfOptions?.fit ?? def.fit,
    }

    let fileFormats: ConvertFromPdfTargetFileFormat[] = [
      ...DEFAULT_FILE_UPLOAD_OPTIONS_FORMAT,
    ]
    if ( pdfOptions?.format ) {
      fileFormats =
        typeof pdfOptions.format === 'string'
          ? [ pdfOptions.format ]
          : pdfOptions.format
    }

    let pageCount = 0

    for ( const format of fileFormats ) {
      const convertRes: WriteImageResponse[] = await fromPath( pdfFilePath, {
        ...options,
        format,
      } ).bulk( -1 )
      pageCount = convertRes.length
      res.push( convertRes )

      for ( const item of convertRes ) {
        const targetPath = item.path
          .split( targetFileSuffix + ORIG_SUFFIX )
          .join( targetFileSuffix )
        const targetName = item.name
          .split( targetFileSuffix + ORIG_SUFFIX )
          .join( targetFileSuffix )

        const imageProps = await getImageMetadataSharp( item.path )
        if (
          Math.abs( imageProps.width - options.width ) >
          options.resizeThreshold ||
          Math.abs( imageProps.height - options.height ) > options.resizeThreshold
        ) {
          const resizedImage: Buffer = await resizeImageFileToBufferSharp(
            item.path,
            options.width,
            options.height,
            options.fit,
            { r: 255, g: 255, b: 255 },
            { density: imageProps.density },
          )

          await FileUtils.writeFileAsync( targetPath, resizedImage )

          item.path = targetPath
          item.name = targetName
          item.fileSize = resizedImage.length
          item.size = `${options.width}х${options.height}`
        } else {
          await FileUtils.copyFile( item.path, targetPath )
          item.path = targetPath
          item.name = targetName
        }
      }
    }

    return {
      convertResults: res,
      fileFormats,
      pageCount,
    }
  }
}
