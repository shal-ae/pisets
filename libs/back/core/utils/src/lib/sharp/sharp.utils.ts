import { ImageMetadataSharp } from '@rka/core-utils'
import sharp, { Color, FitEnum, WriteableMetadata } from 'sharp'
import { FileUtils } from '../files/file.utils'


export const getImageMetadataSharp = async function(
  filename: string,
): Promise<ImageMetadataSharp> {
  return (await sharp( filename ).metadata()) as ImageMetadataSharp
}

export const resizeImageFileToBufferSharp = async function(
  sourceFile: string,
  width?: number,
  height?: number,
  fit?: keyof FitEnum,
  background?: Color,
  metadata?: WriteableMetadata,
): Promise<Buffer> {
  return sharp( sourceFile )
    .withMetadata( metadata ?? {} )
    .resize( {
      width,
      height,
      fit: fit ?? sharp.fit.inside,
      background,
    } )
    .toBuffer()
}

export const resizeImageFileToFileSharp = async function(
  sourceFile: string,
  outputFile: string,
  width?: number,
  height?: number,
): Promise<any> {
  FileUtils.createPathForFileIfNotExist( outputFile )

  return sharp( sourceFile )
    .resize( {
      width,
      height,
      fit: sharp.fit.inside,
    } )
    .toFile( outputFile )
}
