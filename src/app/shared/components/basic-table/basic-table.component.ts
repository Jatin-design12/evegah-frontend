//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss'],
})
export class BasicTableComponent implements OnInit {
  dataSource = new MatTableDataSource();
  @Output("onAction") emitter = new EventEmitter();
  @Output("onRowAction") emitterEvent = new EventEmitter;
  @Output("onCheckboxEvent") checkboxemitterEvent = new EventEmitter;
  @Input() data: any = [];
  @Input() excelName: string;
  @Input("cols") tableCols = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  columnInfo: any
  keys: any = []
  selection = new SelectionModel<any>(true, []);
  pdfContent: any;

  // Advance Search
  showSearch = false

  constructor(  private dailogRef  : MatDialog , ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.columnInfo = [...this.tableCols];
    this.columnInfo.forEach((column) => {
      column.hidden = false;
    })
    this.getDataKeys();

    pdfMake.vfs = pdfFonts.pdfMake.vfs;


  }
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes.data.currentValue)
  
    this.data = changes.data.currentValue;
    this.setPaginationAndSorting();
    this.getPdfContent();


  }
  ngAfterViewInit() {
    this.setPaginationAndSorting();
  }
  // We will need this getter to exctract keys from tableCols
  getDataKeys() {
    this.keys = [];
    this.columnInfo.map((item) => {
      if (!item.hidden) {

        this.keys.push(item.key);

      }
    });
    return this.keys;
  }


  // this function will return a value from column configuration
  // depending on the value that element holds
  showBooleanValue(elt, column) {
    return column.config.values[`${elt[column.key]}`];
  }

  setPaginationAndSorting() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }
  /**
   * function for filter
   * @param filterValue:
   */
  applyFilter(filterValue: string) {
    this.dataSource = new MatTableDataSource(this.data);
    this.setPaginationAndSorting();
    const val = filterValue.trim().toLowerCase();
    this.dataSource.filter = val
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } // end of applyFilter

  filterData(key, value) {
    let filterValue: any = {}
    filterValue[key] = value.trim().toLowerCase()
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify(filterValue)
  }



  // Custom filter method for Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  actionHandler(action, data) {
    const actionData = {
      action: action,
      data: data
    }
   // alert(actionData)
  
    if(data.qr){
      this.dailogRef.open(PopUpComponent,{data:{pageValue:data.qr,lockNumber:data.lockNumber}})
    }else{
       // alert(actionData)
        this.emitter.emit(actionData);
    }
  }

  checkboxSelect(element){
    this.checkboxemitterEvent.emit(element)
  }

  // Advance Search Function

  changeSearchStatus() {
    this.showSearch = !this.showSearch
  }
  // for column drag and drop and hide show
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(this.columnInfo, event.item.data.columnIndex, event.currentIndex);
    this.getDataKeys();
    this.emitColumns(true);
  }

  /**************     for check boxes ******************   */

  toggleSelectedColumn(columnId: string) {
    const colFound = this.columnInfo.find(col => col.key === columnId);
    colFound.hidden = !colFound.hidden;
    this.getDataKeys();
    this.emitColumns(true);
  }



  private emitColumns(saveColumns: boolean) {
    // Only emit the columns on the next animation frame available
    window.requestAnimationFrame(() => {
      this.columnInfo.filter(colInfo => !colInfo.hidden).map(colInfo => colInfo.key);

    });

  }
  // for check boxes
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  //******************* pdf **************** */
  // pdf() {
  //   const documentDefinition = this.pdfData();
  //   pdfMake.createPdf(documentDefinition).download(this.excelName);

  // }

  /**
 * funtion to create a
 * data for pdf download
 * To:Do : refactor
 */
  async getPdfContent() {
    let headerItemArray: any = [];
    let headerItem: any = {};
    let finalHeader: any = [];
    for (let i = 0; i < this.tableCols.length; i++) {
      if (this.tableCols[i].sort) {
        headerItem = {
          text: this.tableCols[i].display,
          style: 'itemsHeader',
        };
        if (i == 0) {
          headerItem.style = ['itemsHeader', 'center'];
        }
        await headerItemArray.push(headerItem);
      }
    }
    finalHeader.push(headerItemArray);
    // row data creation
    let rowArray: any = [];
    let mainRow: any = [];
    for (let j = 0; j < this.data.length; j++) {
      for (let k = 0; k < this.tableCols.length; k++) {
        if (this.tableCols[k].sort) {
          const rowData = {
            text: this.data[j][this.tableCols[k].key],
            style: 'itemSubTitle',
          };
          rowArray.push(rowData);
        }
      }
      mainRow.push(rowArray);
      rowArray = [];
    }
    this.pdfContent = [...finalHeader, ...mainRow];
  } // get pdfContent end...
  rowClickEvent(event) {
    this.emitterEvent.emit(event);
  }
  pdf(event) {
    // console.log(event)
    // const documentDefinition = this.pdfData(event);

    // pdfMake.createPdf(documentDefinition).download(event);
   // pdfMake.createPdf(documentDefinition).open(event);
   //window.print();
   let img : string ;
   img = JSON.stringify(event.qr)
    const WindowPrt = window.open('', '', 'left=0,top=0,right=0,width=0,height=0,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write('<html><head></head><body style="text-align:center; margin-top:40%" onload="window.print()">' + '<img  style="width:200px; height:200px" src='+ img + 'alt="Red dot"  />' + '<p>' + event.lockNumber + '</p>' + '</html>');
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
   // WindowPrt.close();
  }

  pdfData(event) {
    let qr = event.qr
    return {
     
      content: [
        {
          qr: qr,
          fit: '300',
        }
      ],
      footer: {
        columns: [
          "Device Id : " + event.lockNumber,  
          { text: 'Right part', alignment: 'left' },
        ]
      },
    };
  }

}
