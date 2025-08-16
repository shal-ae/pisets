import { DocumentForSignatureFields, UploadedFile } from './doc4s.types'

export function newDocumentForSignatureFields(
  authorId: number | null = null,
): DocumentForSignatureFields {
  return {
    id: 0,
    num: 0,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedByUserId: null,

    subject: '',
    description: '',

    type: '',
    incomingDocumentNumber: '',
    incomingDocumentDate: null,

    counterparty: '',

    status: 'draft',
    approveComments: '',
  }
}

export function testDocumentForSignatureFields(): Omit<
  DocumentForSignatureFields,
  'id' | 'authorId'
> {
  return {
    //    authorId: null,
    num: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedByUserId: null,

    subject: 'На согласование',
    description: 'Канитель еще та',

    type: 'договор с клиентом',
    incomingDocumentNumber: '23444-ВА',
    incomingDocumentDate: new Date(),

    counterparty: 'Рога с копытами',

    status: 'approved',
    approveComments: 'ok',
  }
}

export const TestUploadedFile: UploadedFile[] = []
