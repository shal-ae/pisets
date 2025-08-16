import { FileFolder } from '../types/_/file-folder.types'

export function erpFileUrlByCode(
  code: string,
  fileFolderArray: FileFolder[],
): string {
  const parts = code.split( ':' )
  if ( parts.length !== 2 ) {
    return ''
  }
  const folderCode = parts[ 0 ] //
  const fn = parts[ 1 ] //   d41258c74fb24f2243525c3aaad33143.png

  const fileFolderItem: FileFolder | undefined = fileFolderArray.find(
    ( e ) => e.id === folderCode,
  )
  if ( !fileFolderItem ) {
    return ''
  }
  return fileFolderItem.folder +
    '/' +
    fn.substring( 0, 2 ) +
    '/' +
    fn.substring( 2, 4 ) +
    '/' +
    fn
}
