import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss']
})
export class HistoryTableComponent implements OnInit {

  dataSource = new MatTableDataSource();
  @Output("onAction") emitter = new EventEmitter();
  @Input() data;
  @Input() excelName: string;
  @Input("cols") tableCols = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnInfo: any
  keys: any = []
  pdfContent: any;


  // displayCol:any

  // Advance Search
  showSearch = false

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.columnInfo = [...this.tableCols];
    this.columnInfo.forEach((column) => {
      column.hidden = false;
    })
    this.getDataKeys();

    pdfMake.vfs = pdfFonts.pdfMake.vfs;



    // END Items

  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.setPaginationAndSorting();

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(changes.data.currentValue)
    this.data = changes.data.currentValue;
    this.setPaginationAndSorting();
    this.getPdfContent();


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
    // this.dataSource.sort = this.sort
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



  changeSearchStatus() {
    this.showSearch = !this.showSearch
  }
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
         headerItemArray.push(headerItem);
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

pdf() {
  const documentDefinition = this.pdfData();
  pdfMake.createPdf(documentDefinition).open();
}

pdfData() {
  return {
    // page size setup
    pageSize: 'A4',
    // page margin setup
    border: true,
    pageMargins: [0, 0, 0, 0],

    content: [
      {
        style: 'tableHead',
        table: {
          widths: ['*', '*'],
          border: ScrollDispatcher,
          headerRows: 1,
          body: [
            [
              {
                text: 'Jewel-partner',
                style: 'tableHeader',
                colSpan: 2,
                margin: [5, 5, 5, 5],
                alignment: 'center',
              },
            ],
          ],
        },
        layout: 'noBorders',
      },

      {
        // for table top space
        margin: [5, 10, 5, 5],
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          margin: [0, 15, 0, 0],
          body: this.pdfContent,
          // this.pdfContent.header,
        }, // table
        // layout: 'lightHorizontalLines'
      },
    ],

    styles: {
      // Document Header
      tableHeader: {
        bold: true,
        fontSize: 18,
      },
      tableArea: {
        fillColor: '#f0f4f7',
      },
      tableHead: {
        fillColor: '#74aff0',
        width: '100',
        color: '#fff',
      },

      // Invoice Title
      amountTitle: {
        fontSize: 10,
        bold: false,
        alignment: 'center',
        margin: [0, 0, 0, 5],
      },

      // Items Header
      itemsHeader: {
        margin: [5, 5, 5, 5],
        bold: true,
        fontSize: 11,
      },
      // Item Title
      itemTitle: {
        bold: true,
      },
      itemSubTitle: {
        italics: false,
        fontSize: 11,
        normal: true,
        margin: [5, 5, 5, 5],
      },
      itemNumber: {
        margin: [0, 5, 0, 5],
        alignment: 'center',
      },
      center: {
        alignment: 'center',
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };
}

}
