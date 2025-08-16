import { ErpFile } from './erp-file.types'

export interface Stamp1C {
  id: string;
  name: string;
  type: string;
  files: ErpFile[];
}
