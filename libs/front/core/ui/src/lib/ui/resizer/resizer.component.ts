import { CdkDrag } from '@angular/cdk/drag-drop'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { deepClone } from '@rka/core-utils'
import {
  AspectCalcResult,
  DragHandle,
  DragRestriction,
  EmptyRect,
  MouseMovement,
  Rect,
  RectChangeEvent,
  RectReadOnly,
} from './resizer.types'

/** Компонент для изменения размеров и положения других компонентов.
 *
 * Если во время перемещения или изменения размеров
 * нажат Shift - не сохраняются пропорции
 *
 * нажат Alt - не учитываются Restrictions
 * */
@Component( {
  selector: 'lib-resizer',
  standalone: true,
  imports: [ CdkDrag ],
  templateUrl: './resizer.component.html',
  styleUrl: './resizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class ResizerComponent implements OnChanges {
  /** @ignore */
  sizeText = ''

  /** Курсор мыши находится над компонентом*/
  mouseOver: boolean = false

  /** Позиция { left, top, width, height } */
  @Input( { required: true } ) rect: RectReadOnly = EmptyRect

  /** Элемент в фокусе, выделен цветом  */
  @Input() focused = false

  /** Элемент изменил фокус (клик на элементе, клик снаружи, начало перетаскиваний)
   *
   * При изменении снаружи свойства *focused* - не вызывается */
  @Output() controlChangedFocus = new EventEmitter<boolean>()

  /** Элемент сам себя при кликах не выделяет */
  @Input() autoFocus = true

  /** Вызывается при начале перетаскивания или изменения размеров.  */
  @Output() onDragStared: EventEmitter<RectChangeEvent> =
    new EventEmitter<RectChangeEvent>()

  /** Вызывается в процессе перетаскивания или изменения размеров. В параметрах передаются новое и старое положение и размеры  */
  @Output() onDragging: EventEmitter<RectChangeEvent> =
    new EventEmitter<RectChangeEvent>()

  /** Вызывается при завершении перетаскивания или изменения размеров. В параметрах передаются новое и старое положение и размеры  */
  @Output() onDragEnded: EventEmitter<RectChangeEvent> =
    new EventEmitter<RectChangeEvent>()

  /** Показывать строку с размерами и координатами  */
  @Input() showPositionCaption = false

  /** Ограничения по перемещениям   */
  @Input() dragRestriction?: DragRestriction

  /** Показывать элементы перемещения только при наведении   */
  @Input() showControlsOnHover = true

  /** Показывать элементы перемещения всегда   */
  @Input() showControlsAlways = true

  /** @ignore */
  @HostBinding( 'style.top.px' ) hostTop = 0

  /** @ignore */
  @HostBinding( 'style.left.px' ) hostLeft = 0

  /** @ignore */
  @HostBinding( 'style.width.px' ) hostWidth = 0

  /** @ignore */
  @HostBinding( 'style.height.px' ) hostHeight = 0

  /** @ignore */
  @ViewChild( 'handleLeftTop' ) handleLefTop!: ElementRef

  /** @ignore */
  @ViewChild( 'handleRightTop' ) handleRightTop!: ElementRef

  /** @ignore */
  @ViewChild( 'handleLeftBottom' ) handleLeftBottom!: ElementRef

  /** @ignore */
  @ViewChild( 'handleRightBottom' ) handleRightBottom!: ElementRef

  /** @ignore */
  @ViewChild( 'handleLeft' ) handleLeft!: ElementRef

  /** @ignore */
  @ViewChild( 'handleRight' ) handleRight!: ElementRef

  /** @ignore */
  @ViewChild( 'handleTop' ) handleTop!: ElementRef

  /** @ignore */
  @ViewChild( 'handleBottom' ) handleBottom!: ElementRef

  /** @ignore */
  @ViewChild( 'wr' ) wr!: ElementRef

  private hostDragStartRect: RectReadOnly = deepClone( EmptyRect )
  private dragStartRect: RectReadOnly = deepClone( EmptyRect )
  private hostRect: RectReadOnly = deepClone( EmptyRect )

  private draggingOk = false

  /** @ignore */
  private setHostRect( rect: Rect ) {
    this.hostRect = rect
    this.hostTop = rect.top
    this.hostLeft = rect.left
    this.hostWidth = rect.width
    this.hostHeight = rect.height
  }

  ngOnChanges( changes: SimpleChanges ): void {
    const cv = changes[ 'rect' ]?.currentValue
    if ( cv ) {
      this.setHostRect( cv )
      this.dragStartRect = EmptyRect
      this.hostDragStartRect = EmptyRect
      this.calculatePositionCaption()
    }
  }

  /** @ignore */
  dragStarted( handle: DragHandle, $event: any ) {
    this.changeFocused( true )

    this.dragStartRect = this.hostRect

    this.onDragStared.emit( {
      dragHandle: handle,
      startPosition: this.dragStartRect,
      currentPosition: this.hostRect,
      $event,
    } )
  }

  /** @ignore */
  dragMoved( handle: DragHandle, $event: any ) {
    const shiftKey = $event.event?.shiftKey
    const altKey = $event.event?.altKey

    const move = this.getMouseMovementByDragHandle( handle )
    if ( !move ) {
      return
    }

    const dragStartRight = this.dragStartRect.left + this.dragStartRect.width
    const dragStartBottom = this.dragStartRect.top + this.dragStartRect.height

    let newHostLeft: number | undefined = undefined
    let newHostTop: number | undefined = undefined
    let newHostWidth: number | undefined = undefined
    let newHostHeight: number | undefined = undefined
    let asp: AspectCalcResult | null = null

    if ( handle === 'handleBottom' ) {
      const newWidth = this.dragStartRect.width
      const newHeight = this.dragStartRect.height + move.distY
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        0,
        move.distY,
        !shiftKey,
        true,
        false,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostLeft = this.dragStartRect.left - asp.newDX / 2
    }

    if ( handle === 'handleTop' ) {
      const newWidth = this.dragStartRect.width
      const newHeight = this.dragStartRect.height - move.distY
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        0,
        move.distY,
        !shiftKey,
        true,
        false,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostLeft = this.dragStartRect.left - asp.newDX / 2
      newHostTop = this.dragStartRect.top + asp.newDY
    }

    if ( handle === 'handleRight' ) {
      const newWidth = this.dragStartRect.width + move.distX
      const newHeight = this.dragStartRect.height
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        move.distX,
        0,
        !shiftKey,
        false,
        true,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostTop = this.dragStartRect.top - asp.newDY / 2
    }

    if ( handle === 'handleLeft' ) {
      const newWidth = this.dragStartRect.width - move.distX
      const newHeight = this.dragStartRect.height
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        move.distX,
        0,
        !shiftKey,
        false,
        true,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostLeft = this.dragStartRect.left + asp.newDX
      newHostTop = this.dragStartRect.top - asp.newDY / 2
    }

    if ( handle === 'handleRightBottom' ) {
      const newWidth = this.dragStartRect.width + move.distX
      const newHeight = this.dragStartRect.height + move.distY
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        move.distX,
        move.distY,
        !shiftKey,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
    }

    if ( handle === 'handleLeftTop' ) {
      const newWidth = this.dragStartRect.width - move.distX
      const newHeight = this.dragStartRect.height - move.distY
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        move.distX,
        move.distY,
        !shiftKey,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostLeft = dragStartRight - this.hostWidth
      newHostTop = dragStartBottom - this.hostHeight
    }

    if ( handle === 'handleLeftBottom' ) {
      const newWidth = this.dragStartRect.width - move.distX
      const newHeight = this.dragStartRect.height + move.distY
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        move.distX,
        move.distY,
        !shiftKey,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostLeft = dragStartRight - this.hostWidth
    }

    if ( handle === 'handleRightTop' ) {
      const newWidth = this.dragStartRect.width + move.distX
      const newHeight = this.dragStartRect.height - move.distY
      asp = this.updateFromAspectRatio(
        newWidth,
        newHeight,
        move.distX,
        move.distY,
        !shiftKey,
      )
      newHostWidth = asp.newWidth
      newHostHeight = asp.newHeight
      newHostTop = dragStartBottom - this.hostHeight
    }

    $event.source._dragRef.reset()

    if ( !asp ) {
      return
    }

    this.draggingOk = !asp.error

    if ( this.draggingOk && this.dragRestriction ) {
      const restricted =
        !altKey &&
        this.positionRestricted( {
          left: newHostLeft ?? this.dragStartRect.left,
          top: newHostTop ?? this.dragStartRect.top,
          width: newHostWidth ?? this.dragStartRect.width,
          height: newHostHeight ?? this.dragStartRect.height,
        } )

      if ( restricted ) {
        this.draggingOk = false
      }
    }

    if ( this.draggingOk ) {
      this.setHostRect( {
        left: newHostLeft ?? this.dragStartRect.left,
        top: newHostTop ?? this.dragStartRect.top,
        width: newHostWidth ?? this.dragStartRect.width,
        height: newHostHeight ?? this.dragStartRect.height,
      } )
    }

    this.onDragging.emit( {
      dragHandle: handle,
      startPosition: this.dragStartRect,
      currentPosition: this.hostRect,
      $event,
    } )

    this.calculatePositionCaption()
  }

  /** @ignore */
  dragEnded( dragHandle: DragHandle, $event: any ) {
    this.onDragEnded.emit( {
      dragHandle,
      startPosition: this.dragStartRect,
      currentPosition: this.hostRect,
      $event,
    } )
    this.calculatePositionCaption()
  }

  /** @ignore */
  hostDragStarted( $event: any ) {
    this.changeFocused( true )
    this.hostDragStartRect = { ...this.hostRect }
    this.onDragStared.emit( {
      dragHandle: 'content',
      startPosition: this.hostDragStartRect,
      currentPosition: this.hostRect,
      $event,
    } )
  }

  /** @ignore */
  hostDragMoved( $event: any ) {
    const altKey = $event.event?.altKey
    const move = this.getMouseMovementByDragHandle( 'content' )
    if ( !move ) {
      return
    }
    const newHostLeft = this.hostDragStartRect.left + move.distX
    const newHostTop = this.hostDragStartRect.top + move.distY

    $event.source._dragRef.reset()

    const restricted =
      !altKey &&
      this.positionRestricted( {
        left: newHostLeft,
        top: newHostTop,
        width: this.hostDragStartRect.width,
        height: this.hostDragStartRect.height,
      } )

    if ( !restricted ) {
      this.setHostRect( {
        ...this.hostRect,
        left: newHostLeft,
        top: newHostTop,
      } )
    }

    this.onDragging.emit( {
      dragHandle: 'content',
      startPosition: this.hostDragStartRect,
      currentPosition: this.hostRect,
      $event,
    } )

    this.calculatePositionCaption()
  }

  /** @ignore */
  hostDragEnded( $event: any ) {
    this.onDragEnded.emit( {
      dragHandle: 'content',
      startPosition: this.hostDragStartRect,
      currentPosition: this.hostRect,
      $event,
    } )
    this.calculatePositionCaption()
  }

  /** @ignore */
  private getMouseMovementByDragHandle(
    handle: DragHandle,
  ): MouseMovement | undefined {
    let transform
    if ( handle === 'handleRightBottom' ) {
      transform = this.handleRightBottom.nativeElement.style.transform
    } else if ( handle === 'handleLeftBottom' ) {
      transform = this.handleLeftBottom.nativeElement.style.transform
    } else if ( handle === 'handleLeftTop' ) {
      transform = this.handleLefTop.nativeElement.style.transform
    } else if ( handle === 'handleRightTop' ) {
      transform = this.handleRightTop.nativeElement.style.transform
    } else if ( handle === 'handleLeft' ) {
      transform = this.handleLeft.nativeElement.style.transform
    } else if ( handle === 'handleRight' ) {
      transform = this.handleRight.nativeElement.style.transform
    } else if ( handle === 'handleTop' ) {
      transform = this.handleTop.nativeElement.style.transform
    } else if ( handle === 'handleBottom' ) {
      transform = this.handleBottom.nativeElement.style.transform
    } else if ( handle === 'content' ) {
      transform = this.wr.nativeElement.style.transform
    }
    if ( !transform ) {
      return undefined
    }
    let regex =
      /translate3d\(\s?(?<x>[-]?\d*)px,\s?(?<y>[-]?\d*)px,\s?(?<z>[-]?\d*)px\)/
    const values = regex.exec( transform ) ?? [ '0', '0' ]
    const distX = values[ 1 ] ? parseInt( values[ 1 ] ) : 0
    const distY = values[ 2 ] ? parseInt( values[ 2 ] ) : 0
    return { distX, distY }
  }

  /** @ignore */
  private calculatePositionCaption() {
    const hp = this.hostRect
    this.sizeText = `${Math.round( hp.width )} x ${Math.round(
      hp.height,
    )}, x: ${Math.round( hp.left )}, y: ${Math.round( hp.top )}`
  }

  /** @ignore */
  private updateFromAspectRatio(
    newWidth: number,
    newHeight: number,
    distX: number,
    distY: number,
    keepAspectRatio: boolean,
    calcWidthOnly = false,
    calcHeightOnly = false,
  ): AspectCalcResult {
    const res: AspectCalcResult = {
      newWidth,
      newHeight,
      newDX: distX,
      newDY: distY,
      error: false,
    }
    if ( keepAspectRatio ) {
      const oldRatio = this.dragStartRect.width / this.dragStartRect.height
      const newRatio = newWidth / newHeight

      if ( calcWidthOnly ) {
        res.newWidth = res.newHeight * oldRatio
        res.newDX = distX + res.newWidth - newWidth
      } else if ( calcHeightOnly ) {
        res.newHeight = res.newWidth / oldRatio
        res.newDY = distY + res.newHeight - newHeight
      } else {
        if ( newRatio > oldRatio ) {
          res.newHeight = res.newWidth / oldRatio
          res.newDY = distY + res.newHeight - newHeight
        }
        if ( newRatio < oldRatio ) {
          res.newWidth = res.newHeight * oldRatio
          res.newDX = distX + res.newWidth - newWidth
        }
      }
    }
    res.error = res.newWidth <= 0 || res.newHeight <= 0
    return res
  }

  /** @ignore */
  private positionRestricted( position: Rect ): boolean {
    if ( !this.dragRestriction ) {
      return false
    }
    if (
      this.dragRestriction.minLeft !== undefined &&
      position.left < this.dragRestriction.minLeft
    ) {
      return true
    }
    if (
      this.dragRestriction.maxRight !== undefined &&
      position.left + position.width > this.dragRestriction.maxRight
    ) {
      return true
    }
    if (
      this.dragRestriction.minTop !== undefined &&
      position.top < this.dragRestriction.minTop
    ) {
      return true
    }
    if (
      this.dragRestriction.maxBottom !== undefined &&
      position.top + position.height > this.dragRestriction.maxBottom
    ) {
      return true
    }
    return false
  }

  /** @ignore */
  mouseClick( $event: MouseEvent ) {
    this.changeFocused( true )
  }

  private eRef: ElementRef = inject( ElementRef )

  /** @ignore */
  @HostListener( 'document:click', [ '$event' ] )
  clickOut( event: MouseEvent ) {
    if ( !this.eRef.nativeElement.contains( event.target ) ) {
      this.changeFocused( false )
    }
  }

  private changeFocused( focused: boolean ) {
    if ( this.autoFocus ) {
      const old = this.focused
      this.focused = focused
      if ( old !== this.focused ) {
        this.controlChangedFocus.emit( this.focused )
      }
    }
  }
}
