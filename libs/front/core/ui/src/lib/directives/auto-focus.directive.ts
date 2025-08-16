import { AfterContentInit, Directive, ElementRef } from '@angular/core'

@Directive( {
  selector: '[libAutoFocus]',
  standalone: true,
} )
export class AutoFocusDirective implements AfterContentInit {
  constructor( private el: ElementRef ) {
  }

  ngAfterContentInit(): void {
    setTimeout( () => this.el.nativeElement.focus() )
  }
}
