import { ImageDesc } from '../../shared/types/image-desc'

export interface StampData {
  id: number;
  name: string;
  sort: number;
  images: ImageDesc[];
}
