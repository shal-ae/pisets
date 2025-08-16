import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DocumentStatus } from 'libs/core/doc4s'
import { DateToStrPipe } from 'libs/front/core/ui/src'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox'
import { NzEmptyComponent } from 'ng-zorro-antd/empty'
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm'
import { map, switchMap } from 'rxjs'
import { BasePageComponent } from '../../../shared/controls/base-page.component'
import { StatusButtonsComponent } from '../../../shared/controls/ui/status-buttons/status-buttons.component'
import { StatusIconComponent } from '../../../shared/controls/ui/status-icon/status-icon.component'
import { Doc4sListStore } from '../../../shared/store/doc4s.list.store'
import { Doc4sStore } from '../../../shared/store/doc4s/doc4s.store'
import { BackendRoutes } from '../../../shared/types/backend.routes'
import { DocumentForSignatureFields } from '../../../shared/types/doc4s.types'
import { FrontendRoutes } from '../../../shared/types/frontend.routes'
import { Doc2strPipe } from '../doc4s-list-page/pipes/doc2str.pipe'
import { Doc4sEditInstructionComponent } from './ui/doc4s-edit-instruction/doc4s-edit-instruction.component'
import { EditDoc4sPropsDialogComponent } from './ui/edit-doc4s-props-dialog/edit-doc4s-props-dialog.component'
import { FilesAndPagesListsComponent } from './ui/files-and-pages-lists/files-and-pages-lists.component'
import { PagesEditorComponent } from './ui/pages-editor/pages-editor.component'
import { StatusListComponent } from './ui/status-list/status-list.component'

@Component( {
  selector: 'app-doc4s-edit-page',
  standalone: true,
  templateUrl: './doc4s-edit-page.component.html',
  styleUrl: './doc4s-edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PagesEditorComponent,
    NzEmptyComponent,
    NzButtonModule,
    NzPopconfirmDirective,
    EditDoc4sPropsDialogComponent,
    StatusIconComponent,
    FilesAndPagesListsComponent,
    StatusListComponent,
    StatusButtonsComponent,
    Doc4sEditInstructionComponent,
    NzCheckboxComponent,
    FormsModule,
    DateToStrPipe,
  ],
} )
export class Doc4sEditPageComponent extends BasePageComponent implements OnInit {
  doc4s = inject( Doc4sStore )
  doc4sList = inject( Doc4sListStore )

  save( close = false ) {
    this.doc4s
      .save()
      .pipe(
        switchMap( ( id: number ) => this.doc4sList.load( this.cfg.config.apiAddress + BackendRoutes.doc4sList, true ) ),
        map( () => {
          if ( close ) {
            this.router.navigateByUrl( FrontendRoutes.doc4sList ).then()
          }
        } ),
      )
      .subscribe()
  }

  onDocumentChanged() {
    this.doc4s.setModified()
    this.doc4s.save().subscribe()
  }

  toList() {
    this.router.navigateByUrl( FrontendRoutes.doc4sList ).then()
  }

  delete() {
    this.doc4sList
      .deleteItems( this.cfg.config.apiAddress + BackendRoutes.doc4sDelete, [ this.doc4s.id() ] )
      .pipe(
        map( () => this.router.navigateByUrl( FrontendRoutes.doc4sList ).then() ),
      )
      .subscribe()
  }

  @ViewChild( EditDoc4sPropsDialogComponent )
  editDoc4sPropsDialogComponent!: EditDoc4sPropsDialogComponent

  editProps() {
    this.editDoc4sPropsDialogComponent.open(
      this.doc4s.stateFieldsToObject(),
      !this.doc4s.canEditProps(),
      !this.doc4s.canEditResponse(),
    )
  }

  onDialogOk( data: DocumentForSignatureFields ) {
    this.doc4s.readToStateFields( data )
    this.doc4s.setModified()
    this.doc4s.save().subscribe()
  }

  statusChange( status: DocumentStatus ) {
    this.doc4s.setStatus( status )
  }

  showInstructionsChange( $event: boolean ) {
    this.app.showInstructions.set( $event )
  }
}
