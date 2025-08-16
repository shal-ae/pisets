export type SharpDensityResolutionUnit = 'inch' | 'cm';

export interface ImageMetadataSharp {
  format: string;
  width: number;
  height: number;
  density: number;
  isProgressive: boolean;
  hasAlpha: boolean;
  resolutionUnit: SharpDensityResolutionUnit;
}
