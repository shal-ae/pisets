type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type RectReadOnly = Readonly<Rect>;

export const EmptyRect: Readonly<Rect> = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
}

export interface MouseMovement {
  distX: number;
  distY: number;
}

export interface RectChangeEvent {
  startPosition: DeepReadonly<Rect>;
  currentPosition: DeepReadonly<Rect>;
  dragHandle: Readonly<DragHandle>;
  $event: any;
}

export type DragHandle =
  | 'content'
  | 'handleLeftTop'
  | 'handleLeftBottom'
  | 'handleRightTop'
  | 'handleRightBottom'
  | 'handleLeft'
  | 'handleRight'
  | 'handleTop'
  | 'handleBottom';

export interface AspectCalcResult {
  newWidth: number;
  newHeight: number;
  newDX: number;
  newDY: number;
  error: boolean;
}

/** Ограничения по перемещению и размерам  */
export interface DragRestriction {
  /** Минимальная координата по оси X */
  minLeft?: number;

  /** Максимальная координата по оси X */
  maxRight?: number;

  /** Минимальная координата по оси Y */
  minTop?: number;

  /** Максимальная координата по оси Y */
  maxBottom?: number;
}
