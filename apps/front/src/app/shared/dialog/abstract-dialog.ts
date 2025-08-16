import { Component, EventEmitter, Input, Output } from '@angular/core'
import { deepClone } from 'libs/core/core-utils'
import { BehaviorSubject, Observable } from 'rxjs'

@Component( { template: '' } )
export abstract class AbstractDialog<R> {
  isVisible = false

  @Input() cloneValue = true
  @Output() onOK: EventEmitter<R> = new EventEmitter<R>()
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>()

  value?: R

  valueBehaviourSubject: BehaviorSubject<R | undefined> = new BehaviorSubject<
    R | undefined
  >( undefined )

  open( value: R ) {
    this.value = this.cloneValue ? deepClone( value ) : value
    this.isVisible = true
  }

  afterClosed( value: R ): Observable<R | undefined> {
    this.open( value )
    return this.valueBehaviourSubject.asObservable()
  }

  handleOk() {
    this.isVisible = false
    this.onOK.emit( this.value )
    this.valueBehaviourSubject.next( this.value )
  }

  handleCancel() {
    this.isVisible = false
    this.onCancel.emit()
    this.valueBehaviourSubject.next( undefined )
  }
}
