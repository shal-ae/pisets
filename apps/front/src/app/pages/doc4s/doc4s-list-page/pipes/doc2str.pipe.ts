import { Pipe, PipeTransform } from '@angular/core'
import { MyUtils } from 'libs/core/core-utils'
import { DocumentForSignatureFields } from '../../../../shared/types/doc4s.types'

@Pipe( {
  name: 'doc2str',
  standalone: true,
} )
export class Doc2strPipe implements PipeTransform {
  transform( value: DocumentForSignatureFields ): string {
    return docFields2str(
      value.type,
      value.incomingDocumentNumber,
      value.incomingDocumentDate,
    )
  }
}

export function docFields2str(
  type?: string,
  incomingDocumentNumber?: string,
  incomingDocumentDate?: Date | null,
) {
  const strParts: string[] = []
  if ( type ) {
    strParts.push( type )
  }
  if ( incomingDocumentNumber ) {
    strParts.push( `№ ${incomingDocumentNumber}` )
  }
  if ( incomingDocumentDate ) {
    const d = MyUtils.formatDateTime( incomingDocumentDate, 'dd.MM.yy' )
    strParts.push( `от ${d}` )
  }
  return strParts.join( ' ' )
}
