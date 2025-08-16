export const THUMBNAILS_DEFAULT: ThumbnailItem[] = [
  { group: '1000', width: 1000, height: 1000 },
  { group: '600', width: 600, height: 600 },
  { group: '400', width: 400, height: 400 },
  { group: '200', width: 200, height: 200 },
  //{group: '100', width: 100, height: 100},
  //{group: '40', width: 40, height: 40},
]

// export type ThumbnailGroupName = '1000' | '600' | '400' | '200' | '100' | '40'

export type ThumbnailItem = {
  group: string;
  width: number;
  height: number;
};
