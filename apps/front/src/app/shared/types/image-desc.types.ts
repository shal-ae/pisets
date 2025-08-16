import { FileUploadResult } from 'libs/core/core-utils'

export interface ImageDesc {
  src: string;
  srcThumbnail?: string;
  srcView?: string;
  width: number;
  height: number;
  widthMm: number;
  heightMm: number;
  dpiX: number;
  dpiY: number;
}

export function imageDescFromUploadedInfo(
  res: FileUploadResult | undefined,
  fileFolder = '',
): ImageDesc | undefined {
  if ( !res ) {
    return undefined
  }
  const md = res.originalImageMetadata
  if ( !md ) {
    return undefined
  }
  let f = res.filePath
  if ( f.startsWith( fileFolder ) ) {
    f = f.substring( fileFolder.length )
  }
  const density = md.density || 300
  const result: ImageDesc = {
    src: f,
    width: md.width,
    height: md.height,
    widthMm: 0,
    heightMm: 0,
    dpiX: density,
    dpiY: density,
  }
  calculateSizesInMmOfImageDesc( result )
  return result
}

export function calculateSizesInMmOfImageDesc( data: ImageDesc ) {
  data.widthMm = Math.round( ((data.width * 10) / data.dpiX) * 25.4 ) / 10
  data.heightMm = Math.round( ((data.height * 10) / data.dpiY) * 25.4 ) / 10
}
