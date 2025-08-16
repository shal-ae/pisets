export type ThumbnailGroupName = '400' | '200' | '100' | '40'

export type ThumbnailItem = {
  group: ThumbnailGroupName
  width: number
  height: number
}
export const THUMBNAIL_DATA: ThumbnailItem[] = [
  { group: '400', width: 400, height: 400 },
  { group: '200', width: 200, height: 200 },
  { group: '100', width: 100, height: 100 },
  { group: '40', width: 40, height: 40 },
]
