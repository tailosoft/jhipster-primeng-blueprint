import { NgModule } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    TriStateCheckboxModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    MessageModule,
    ToastModule,
    TooltipModule,
    FileUploadModule
  ],
  exports: [
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    TriStateCheckboxModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    MessageModule,
    ToastModule,
    TooltipModule,
    FileUploadModule
  ]
})
export class PrimeNGCommonModule {}
