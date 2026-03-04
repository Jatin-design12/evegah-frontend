import { Directive, HostListener, Input } from '@angular/core';
import { ExportService } from '../services/excel-export.services';


@Directive({
  selector: '[excelExport]'
})
export class ExportDirective {

  constructor(private exportService: ExportService) { }

  @Input('excelExport') data: any[];
  @Input() fileName: string;

  @HostListener('click', ['$event']) onClick($event) {
    this.exportService.exportExcel(this.data, this.fileName);
  }

}
