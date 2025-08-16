import { fillStatusBooleanData, StatusBooleanData } from 'libs/core/doc4s'

export type AccessFieldsState = {
  canEditRequest: boolean;
  canEditResponse: boolean;
  canEditProps: boolean;
  canListAll: boolean;
  disabledStatuses: StatusBooleanData;
};

export const DefaultAccess: AccessFieldsState = {
  canEditRequest: false,
  canEditResponse: false,
  canEditProps: false,
  canListAll: false,
  disabledStatuses: fillStatusBooleanData( false ),
}
