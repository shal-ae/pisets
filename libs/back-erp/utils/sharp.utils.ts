import sharp from 'sharp'
import { FileUtils } from './file.utils'

export interface ImageMetadataSharp {
  format: string
  width: number,
  height: number,
  density: number,
  isProgressive: boolean,
  hasAlpha: boolean
}

export const getImageMetadataSharp = async function( filename: string ): Promise<ImageMetadataSharp> {
  return (await sharp( filename ).metadata() as ImageMetadataSharp)
}

export const resizeImageFileToBufferSharp = async function( sourceFile: string, width?: number, height?: number ): Promise<Buffer> {
  return sharp( sourceFile )
    .resize( {
      width,
      height,
      fit: sharp.fit.inside,
    } )
    .toBuffer()
}

export const resizeImageFileToFileSharp = async function( sourceFile: string, outputFile: string, width?: number, height?: number ): Promise<any> {
  FileUtils.createPathForFileIfNotExist( outputFile )

  return sharp( sourceFile )
    .resize( {
      width,
      height,
      fit: sharp.fit.inside,
    } )
    .toFile( outputFile )
}

