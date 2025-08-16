import { Injectable } from '@nestjs/common'
import { FileUtils } from '@rka/back-utils'
import * as libre from 'libreoffice-convert'
import * as fs from 'node:fs'
import * as util from 'util'

const libreConvertAsync = util.promisify( libre.convert )

export const OFFICE_CONVERT_EXT: string[] = [ 'docx', 'xlsx', 'doc', 'xls' ]

@Injectable()
export class ConvertOfficeService {
  async convertOfficeFileToPdf( sourceFile: string, destinationFile: string ) {
    const docxBuf = await fs.promises.readFile( sourceFile )

    const ext = '.' + FileUtils.fileExt( destinationFile ).toLowerCase()

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await libreConvertAsync( docxBuf, ext, undefined )

    // Here in done you have pdf file which you can save or transfer in another stream
    await fs.promises.writeFile( destinationFile, pdfBuf )
  }
}
