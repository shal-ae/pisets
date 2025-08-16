import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { ImageEventInfo, RolloverPicture } from './picture-rollover.types'

@Component( {
  selector: 'lib-picture-rollover',
  templateUrl: './picture-rollover.component.html',
  styleUrls: [ './picture-rollover.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
} )
export class PictureRolloverComponent implements OnChanges {
  slideWidth = 0

  @Input() pictures: RolloverPicture[] = []

  @Input() pictureWidthPx = 200
  @Input() pictureHeightPx = 150

  @Output() imageClick: EventEmitter<ImageEventInfo> =
    new EventEmitter<ImageEventInfo>()

  @Input() selected = 0
  @Output() selectedChange: EventEmitter<number> = new EventEmitter<number>()

  @Output() onSelectPicture: EventEmitter<number> = new EventEmitter<number>()

  hovered: number | null = null
  @Output() hoveredChange: EventEmitter<ImageEventInfo> =
    new EventEmitter<ImageEventInfo>()

  /** Показанная картинка - = hovered если мышь над элементом, = selected - если мышь не над ним.
   * Если картинок нет - NULL */
  shown: number | null = null
  @Output() onShow: EventEmitter<number | null> = new EventEmitter<
    number | null
  >()

  @Input() selectPictureOnClick = true
  @Input() cursorPointer = true

  @Input() pictogramGapPx = 6
  @Input() pictogramHeightPx = 6
  @Input() hidePictogramWhenMouseOut = false

  @ViewChild( 'picture' ) pictureDiv?: ElementRef

  $mouseMoveEvent?: MouseEvent
  pictureDivRect?: DOMRect

  private cdr = inject( ChangeDetectorRef )

  ngOnChanges( changes: SimpleChanges ): void {
    if ( changes[ 'pictures' ] ) {
      if ( this.selected >= changes[ 'pictures' ].currentValue?.length ) {
        this.changeSelected( 0 )
      }
      if ( changes[ 'pictures' ].currentValue?.length ) {
        setTimeout( () => this.changeShown( this.selected ), 0 )
      } else {
        setTimeout( () => this.changeShown( null ), 0 )
      }
    }
    this.calcSlideSize()
  }

  imageMouseMove( $event: MouseEvent ) {
    this.$mouseMoveEvent = $event
    const x = this.getX( $event )
    const idx = this.pictureIndexByX( x )
    this.changeHovered( idx, $event )
  }

  imageMouseLeave( $event: MouseEvent ) {
    this.changeHovered( null, $event )
  }

  mouseClick( $event: MouseEvent ) {
    this.$mouseMoveEvent = $event
    const x = this.getX( $event )
    const index = this.pictureIndexByX( x )
    if ( this.selectPictureOnClick ) {
      if ( index !== null ) {
        this.changeSelected( index )
      }
    }

    this.imageClick.emit( this.imageEventInfo( index, $event ) )
  }

  private getX( $event: MouseEvent ): number {
    if ( !this.pictureDiv ) {
      return 0
    }
    this.pictureDivRect = this.pictureDiv.nativeElement.getBoundingClientRect()
    const x = $event.pageX - this.pictureDivRect!.left + 1
    return x < 0 ? 0 : x
  }

  private pictureIndexByX( x: number ): number | null {
    if ( !this.pictures.length ) {
      return null
    }
    const itemWidth = Math.floor(
      this.pictureDivRect!.width / this.pictures.length,
    )

    let idx = Math.floor( x / itemWidth )
    if ( idx >= this.pictures.length ) {
      idx = this.pictures.length - 1
    }
    return idx
  }

  private changeHovered( hovered: number | null, $event: MouseEvent ) {
    if ( this.hovered !== hovered ) {
      this.hovered = hovered
      this.hoveredChange.emit( this.imageEventInfo( this.hovered, $event ) )
      if ( hovered !== null ) {
        this.changeShown( hovered )
      }

      if ( hovered === null ) {
        if ( this.selected >= this.pictures.length || this.selected < 0 ) {
          this.changeShown( null )
        } else {
          this.changeShown( this.selected )
        }
      }
    }
  }

  private changeShown( shown: number | null ) {
    this.cdr.markForCheck()
    if ( this.shown !== shown ) {
      this.shown = shown
      this.onShow.emit( this.shown )
    }
  }

  private changeSelected( index: number ) {
    this.selected = index
    this.selectedChange.emit( index )
  }

  private calcSlideSize(): void {
    if ( this.pictures.length ) {
      const cnt = this.pictures.length
      this.slideWidth = Math.floor(
        (this.pictureWidthPx - (cnt - 1) * this.pictogramGapPx) / cnt,
      )
    } else {
      this.slideWidth = 0
    }
  }

  private imageEventInfo(
    index: number | null,
    $event: MouseEvent,
  ): ImageEventInfo {
    if ( index === null ) {
      return { index: null, picture: null, $event }
    } else {
      return { index, picture: this.pictures[ index ], $event }
    }
  }
}
