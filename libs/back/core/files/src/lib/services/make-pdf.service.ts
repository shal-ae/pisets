import { Inject, Injectable } from '@nestjs/common'
import { FileUtils } from '@rka/back-utils'
import {
  deepClone,
  DEFAULT_PDF_PROPERTIES,
  FileUploadResult,
  MakeAndSavePdfRequestBody,
  MakePdfOutFileDescriptor,
  MakePdfPageFromPdf,
  MakePdfPageFromPicture,
  MakePdfRequestBody,
  makeRandomId,
  PDF_FILES_TEMP_SUB_DIR,
  RenderImageOptions,
} from '@rka/core-utils'
import * as muhammara from 'muhammara'
import * as path from 'path'
import { FILES_CONFIG_TOKEN, FilesModuleConfig } from '../types/files-module.types'
import { FilesService } from './files.service'

@Injectable()
export class MakePdfService {
  constructor( private filesService: FilesService,
               @Inject( FILES_CONFIG_TOKEN ) private config: FilesModuleConfig,
  ) {
  }

  async makePdf(
    request: MakePdfRequestBody,
    onPageProcessed: ( pageNum: number ) => Promise<void> | null = null,
  ): Promise<string> {
    const pdfProps = request.outPdfProperties ?? DEFAULT_PDF_PROPERTIES

    const Recipe = muhammara.Recipe

    const filename = makeRandomId( 10 ) + '.pdf'
    let outputFile = ''
    if ( request.folder ) {
      outputFile = path.join(
        this.config.filesDir,
        request.folder,
        filename,
      )
    } else {
      outputFile = path.join(
        this.config.tempDir,
        PDF_FILES_TEMP_SUB_DIR,
        filename,
      )
    }

    FileUtils.createPathForFileIfNotExist( outputFile )

    const pdfDoc = new Recipe( 'new', outputFile, {
      version: 1.6,
      author: pdfProps.author ?? DEFAULT_PDF_PROPERTIES.author,
      title: pdfProps.title ?? DEFAULT_PDF_PROPERTIES.title,
      subject: pdfProps.subject ?? DEFAULT_PDF_PROPERTIES.subject,
    } )

    const pageWidth = pdfProps.width || DEFAULT_PDF_PROPERTIES.width
    const pageHeight = pdfProps.height || DEFAULT_PDF_PROPERTIES.height

    let p = 0
    for ( const page of request.pages ) {
      const ext = FileUtils.fileExt( page.src ).toLowerCase()

      if ( [ 'jpg', 'jpeg', 'png' ].includes( ext ) ) {
        const p: MakePdfPageFromPicture = page as MakePdfPageFromPicture

        let pictureOptions: RenderImageOptions = deepClone( p.options )
        if ( !pictureOptions ) {
          pictureOptions = {
            x: 0,
            y: 0,
            keepAspectRatio: true,
            width: p.pageWidth || pageWidth,
          }
        }

        pdfDoc.createPage( p.pageWidth || pageWidth, p.pageHeight || pageHeight )
        pdfDoc.image(
          page.src,
          p.options?.x || 0,
          p.options?.y || 0,
          pictureOptions,
        )
        pdfDoc.endPage()
      }

      if ( ext === 'pdf' ) {
        const p: MakePdfPageFromPdf = page as MakePdfPageFromPdf
        if ( p.page ) {
          pdfDoc.appendPage( page.src, [ p.page ] )
        } else {
          pdfDoc.appendPage( page.src )
        }
      }

      if ( onPageProcessed ) {
        await onPageProcessed( ++p )
      }
    }

    pdfDoc.endPDF()

    return filename
  }

  async makeAndSavePdf( request: MakeAndSavePdfRequestBody ): Promise<FileUploadResult> {

    const tempFilename = await this.makePdf( request )

    const tempFileFullPath = path.join(
      this.config.tempDir,
      PDF_FILES_TEMP_SUB_DIR,
      tempFilename,
    )
    const stat = FileUtils.getFileStat( tempFileFullPath )

    const fd: MakePdfOutFileDescriptor = {
      path: tempFileFullPath,
      originalname: tempFilename,
      size: stat.fileSizeInBytes,
      filename: tempFilename, //!!!!
    }

    return this.filesService.saveUploadedFile( fd, request.savePdfOptions )
  }
}
