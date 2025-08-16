export interface ImageEventInfo {
  index: number | null;
  picture: RolloverPicture | null;
  $event: MouseEvent;
}

export interface RolloverPicture {
  path: string;
}
