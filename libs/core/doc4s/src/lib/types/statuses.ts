export type DocumentStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'declined'
  | 'cancelled';

export const DocumentStatuses: DocumentStatus[] = [
  'draft',
  'pending',
  'approved',
  'declined',
  'cancelled',
]

export interface StatusMetaItem {
  name: string;
  icon: string;
  color: string;
}

export type StatusMetaData = {
  [key in DocumentStatus]: StatusMetaItem;
};

export const StatusMeta: StatusMetaData = {
  draft: { name: 'Черновик', icon: 'file', color: '#333333' },
  pending: { name: 'В работе', icon: 'edit', color: '#0000ff' },
  approved: { name: 'Утверждён', icon: 'check-circle', color: '#00bb00' },
  declined: { name: 'Отказ', icon: 'exclamation-circle', color: '#993333' },
  cancelled: { name: 'Отменен', icon: 'close-circle', color: '#aaaaaa' },
}

export type StatusBooleanData = {
  [key in DocumentStatus]: boolean;
};

export function fillStatusBooleanData( data: boolean ): StatusBooleanData {
  return {
    draft: data,
    pending: data,
    approved: data,
    declined: data,
    cancelled: data,
  }
}
