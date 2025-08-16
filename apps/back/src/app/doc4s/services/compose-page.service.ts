import { Injectable } from '@nestjs/common'
import {
  ComposeDocumentPageRequest,
  ComposeDocumentPageResponse,
  ComposeItem,
  ImageMetadataSharp,
  MakePdfFromPicturesRequest,
  MakePdfFromPicturesResponse,
  MakePdfPage,
  MakePdfRequestBody,
  makeRandomId,
} from '@rka/core-utils'
import { MakePdfService } from '@rka/files'
import { Job } from 'bullmq'
import { FileUtils, getImageMetadataSharp, resizeImageFileToBufferSharp } from 'libs/back/core/utils/src'
import * as path from 'path'
import sharp from 'sharp'
import { FileLocation } from '../../shared/utils/file-location'
import { RESIZE_THRESHOLD } from '../types/document-page.types'

@Injectable()
export class ComposePageService {
  constructor( private makePdfService: MakePdfService ) {
  }

  async makePdfFromPictures(
    data: MakePdfFromPicturesRequest,
    job: Job<any, any, string> | null = null,
  ): Promise<MakePdfFromPicturesResponse> {
    const PROGRESS_START_MAKE_PDF = 50
    const PROGRESS_END_MAKE_PDF = 90
    let progress = 0

    const pages: MakePdfPage[] = []

    const tempFilesToDelete: string[] = []

    let src = '' // Полный путь файла страницы

    for ( const page of data.pages ) {
      if ( page.stamps.length ) {
        const newPicture = await this.composePage( page )

        if ( page.folder ) {
          src = path.join(
            FileLocation.getFilesDir(),
            page.folder,
            newPicture.filename,
          )
        } else {
          src = path.join( FileLocation.getTempDir(), newPicture.filename )
        }
        tempFilesToDelete.push( src )
      } else {
        src = FileLocation.getFileFilename( page.src ) // page.src in Files dir - 'private/doc4s/22/23ea216bd20050a7e589371c18ec096a.2.jpg'
      }

      pages.push( { src } )
    }

    const request: MakePdfRequestBody = {
      folder: data.folder,
      pages,
    }

    progress = PROGRESS_START_MAKE_PDF
    await job?.updateProgress( progress )

    const filename = await this.makePdfService.makePdf(
      request,
      async ( p: number ): Promise<void> => {
        progress =
          PROGRESS_START_MAKE_PDF +
          (p / request.pages.length) *
          (PROGRESS_END_MAKE_PDF - PROGRESS_START_MAKE_PDF)
        await job?.updateProgress( progress )
      },
    )

    tempFilesToDelete.forEach( ( f ) => {
      FileUtils.deleteFile( f )
    } )
    progress = 100
    await job?.updateProgress( progress )

    return {
      filename,
    }
  }

  /**
   ComposeDocumentPageRequest {
   folder?: string - куда поместить файл, относительный каталог в папке файлов
   пусто - помещает во временный
   'private/doc4s/22/'
   src: string   // src in Files dir
   'private/doc4s/22/23ea216bd20050a7e589371c18ec096a.1.jpg',
   stamps: DocumentStamp[]
   Возвращает только ИМЯ файла без пути
   */
  async composePage(
    data: ComposeDocumentPageRequest,
  ): Promise<ComposeDocumentPageResponse> {
    const bgFile = FileLocation.getFileFilename( data.src )
    const bgFileProps: ImageMetadataSharp = await getImageMetadataSharp( bgFile )
    const bgFileExt = FileUtils.fileExt( bgFile )

    const composeItems: ComposeItem[] = []
    for ( const stamp of data.stamps ) {
      const stampFilename = path.join(
        FileLocation.getFilesDirStamps(),
        stamp.src,
      )
      const stampFilenameProps: ImageMetadataSharp =
        await getImageMetadataSharp( stampFilename )

      const item: ComposeItem = {
        input: stampFilename,
        left: Math.round( (stamp.position.left * bgFileProps.density) / 25.4 ),
        top: Math.round( (stamp.position.top * bgFileProps.density) / 25.4 ),
      }

      const targetWidthPx = Math.round(
        (stamp.position.width * bgFileProps.density) / 25.4,
      )
      const targetHeightPx = Math.round(
        (stamp.position.height * bgFileProps.density) / 25.4,
      )

      if (
        Math.abs( stampFilenameProps.width - targetWidthPx ) > RESIZE_THRESHOLD ||
        Math.abs( stampFilenameProps.height - targetHeightPx ) > RESIZE_THRESHOLD
      ) {
        console.log(
          `stampFilenameProps = ${stampFilenameProps.width} x ${stampFilenameProps.height}, ` +
          `target: ${targetWidthPx} x ${targetHeightPx}`,
        )
        item.input = await resizeImageFileToBufferSharp(
          stampFilename,
          targetWidthPx,
          targetHeightPx,
          sharp.fit.fill,
        )
      }

      composeItems.push( item )
    }

    const filename = makeRandomId( 8 ) + '.' + bgFileExt
    let targetFilename = ''
    if ( data.folder ) {
      targetFilename = path.join(
        FileLocation.getFilesDir(),
        data.folder,
        filename,
      )
    } else {
      targetFilename = path.join( FileLocation.getTempDir(), filename )
    }

    await sharp( bgFile, { density: 300 } )
      .composite( composeItems )
      .toFile( targetFilename )

    return {
      filename,
      meta: await getImageMetadataSharp( targetFilename ),
    }
  }
}
