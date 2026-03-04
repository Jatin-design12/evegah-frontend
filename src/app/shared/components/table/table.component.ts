//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { ToastrService } from 'ngx-toastr';
import { setInstruction } from 'src/app/core/services/setInstruction/setinstructionLockAndUnlock.service';
import { Subscription } from 'rxjs';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { BikeMaintanceComponent } from '../bike-maintance/bike-maintance.component';
import { ADD_SECURITY_DEPOSIT, ADD_WALLET, AVAILABLE, ActiveOrDeactiveButton, BEEPBUTTON, CLEAR_LIGHT_INSTRUCTIONS, CLEAR_LOCK_INSTRUCTIONS, ClientEvegah, DELETE, ENDBUTTON,CANCELWITHDRAW, HISTORY, LIGHTBUTTON, LOCATEBUTTON, LOCKBUTTON, MAINTENANCE, POWER_ON_OFF, Publish, REPLY, ReOrder, ShiftZone, UnublishEnumId } from 'src/app/core/constants/common-constant';
import { HistoryInfoComponent } from '../history-info/history-info.component';
import { TestLockHistoryInfoComponent } from 'src/app/main/test-lock-history-info/test-lock-history-info.component';
import { LocateMapModalComponent } from '../locate-map-modal/locate-map-modal.component';
import { RatingReplyComponent } from '../rating-reply/rating-reply.component';
import { ZoneMapComponent } from 'src/app/main/zone-map/zone-map.component';
import { LocateButtonModalComponent } from 'src/app/main/locate-button-modal/locate-button-modal.component';
import { FaqReOrderComponent } from '../faq-re-order/faq-re-order.component';
import { MetroDeviceService } from 'src/app/core/services/metro-device.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClearInstructionService } from 'src/app/core/services/clear-instruction.service';
import { RechargeWalletModalComponent } from '../recharge-wallet-modal/recharge-wallet-modal.component';
import { enumCodeConstants } from 'src/app/core/constants/enum-code-constants';
import { WithdrawService } from 'src/app/core/services/userTransaction/withdrawTransaction.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  subscription: Subscription[] = [];
  dataSource = new MatTableDataSource();
  @Output('onAction') emitter = new EventEmitter();
  @Output('onRowAction') emitterEvent = new EventEmitter();
  @Output('onCheckboxEvent') checkboxemitterEvent = new EventEmitter();
  @Output('onDone') onDoneEvent = new EventEmitter();
  @Input() data: any = [];
  @Input() excelName: string;
  @Input('cols') tableCols = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  columnInfo: any;
  keys: any = [];
  selection = new SelectionModel<any>(true, []);
  pdfContent: any;

  // Advance Search
  showSearch = false;
  userId: any;
  beep: string = BEEPBUTTON;


  constructor(
    
    public setInstructionService: setInstruction,
    private dailogRef: MatDialog,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private metroDeviceServices: MetroDeviceService,
    private clearInstructionService: ClearInstructionService
  ) { }

  get hasDeleteAction(): boolean {
    return this.hasDeleteActionInColumns(this.tableCols);
  }

  get hasSelectColumn(): boolean {
    return this.hasSelectColumnInColumns(this.tableCols);
  }

  get showBulkActionControls(): boolean {
    return this.hasDeleteAction || this.hasSelectColumn;
  }

  get selectedRowsCount(): number {
    return this.selection?.selected?.length || 0;
  }

  get currentRowsCount(): number {
    return this.getCurrentRows().length;
  }

  ngOnInit(): void {
    // this.userId = JSON.parse(localStorage.getItem('USER_DETAILS'));
    this.userId = JSON.parse(sessionStorage.getItem('user'));
    this.rebuildTableColumns();
    this.dataSource = new MatTableDataSource(this.data);

    this.columnInfo = [...this.tableCols];
    console.log(this.columnInfo)
    this.columnInfo.forEach((column) => {
      column.hidden = false;
    });
    this.getDataKeys();

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tableCols) {
      this.rebuildTableColumns();
      this.columnInfo = [...this.tableCols];
      this.columnInfo.forEach((column) => {
        if (column.hidden === undefined) {
          column.hidden = false;
        }
      });
      this.getDataKeys();
    }

    if (changes.data) {
      this.data = changes.data.currentValue || [];
      this.dataSource = new MatTableDataSource(this.data);
      this.selection.clear();
    }

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
    this.dataSource.sort = this.sort;
  }
  /**
   * function for filter
   * @param filterValue:
   */
  applyFilter(filterValue: string) {
    this.dataSource = new MatTableDataSource(this.data);
    this.selection.clear();
    this.setPaginationAndSorting();
    const val = filterValue.trim().toLowerCase();
    this.dataSource.filter = val;
    //alert(val)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } // end of applyFilter

  filterData(key, value) {
    let filterValue: any = {};
    filterValue[key] = value.trim().toLowerCase();
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify(filterValue);
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
            searchTerms[col]
              .trim()
              .toLowerCase()
              .split(' ')
              .forEach((word) => {
                if (data[col] !== null && data[col] !== undefined) {  // for null colomun value
                  if (
                    data[col].toString().toLowerCase().indexOf(word) != -1 &&
                    isFilterSet
                  ) {
                    found = true;
                  }
                }

              });
          }
          return found;
        } else {
          return true;
        }
      };
      return nameSearch();
    };
    return filterFunction;
  }

  checkboxSelect(element) {
    this.checkboxemitterEvent.emit(element);
  }

  selectAllRows() {
    const rows = this.getCurrentRows();
    this.selection.clear();
    if (rows.length) {
      this.selection.select(...rows);
    }
  }

  selectAndDeleteSelected() {
    if (!this.selection.selected.length) {
      this.toastr.warning('Please select at least one record');
      return;
    }
    this.confirmAndDeleteRows([...this.selection.selected], 'selected');
  }

  deleteAllRows() {
    if (!this.hasDeleteAction) {
      this.toastr.warning('Delete action is not enabled for this table');
      return;
    }
    const rows = this.getCurrentRows();
    if (!rows.length) {
      this.toastr.warning('No records found to delete');
      return;
    }
    this.confirmAndDeleteRows(rows, 'all');
  }

  private confirmAndDeleteRows(rows: any[], mode: 'selected' | 'all') {
    const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
      data: {
        data: `Are you sure you want to delete ${rows.length} record(s)?`,
        action: DELETE,
      },
      height: '300px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      rows.forEach((row) => {
        this.emitter.emit({
          action: DELETE,
          data: row,
          isBulkAction: true,
          bulkMode: mode,
          bulkCount: rows.length,
        });
      });

      this.removeRowsFromDataSource(rows);
      this.selection.clear();
      this.onDoneEvent.emit({ action: DELETE, isBulkAction: true, bulkMode: mode, bulkCount: rows.length });
      this.toastr.success(`${rows.length} record(s) removed from table`);
    });
  }

  private removeRowsFromDataSource(rows: any[]) {
    const deleteKeySet = new Set(rows.map((row) => this.getRowKey(row)));
    const filteredRows = (this.dataSource?.data || []).filter((row: any) => !deleteKeySet.has(this.getRowKey(row)));
    this.data = [...filteredRows];
    this.dataSource = new MatTableDataSource(this.data);
    this.setPaginationAndSorting();
  }

  private getCurrentRows(): any[] {
    if (this.dataSource?.filteredData && this.dataSource.filteredData.length) {
      return [...this.dataSource.filteredData];
    }
    return [...(this.dataSource?.data || [])];
  }

  private getRowKey(row: any): string {
    if (row?.id !== undefined && row?.id !== null) return `id-${row.id}`;
    if (row?.lockId !== undefined && row?.lockId !== null) return `lockId-${row.lockId}`;
    if (row?.lockNumber !== undefined && row?.lockNumber !== null) return `lockNumber-${row.lockNumber}`;
    if (row?.bikeProduceIds !== undefined && row?.bikeProduceIds !== null) return `bikeProduceIds-${row.bikeProduceIds}`;
    if (row?.rideBookingNo !== undefined && row?.rideBookingNo !== null) return `rideBookingNo-${row.rideBookingNo}`;
    return JSON.stringify(row);
  }

  private hasDeleteActionInColumns(columns: any[]): boolean {
    return (columns || []).some((col: any) => {
      const actions = col?.config?.actions;
      return Array.isArray(actions) && actions.includes(DELETE);
    });
  }

  private hasSelectColumnInColumns(columns: any[]): boolean {
    return (columns || []).some((col: any) => col?.key === 'select');
  }

  private rebuildTableColumns() {
    const incomingColumns = Array.isArray(this.tableCols) ? [...this.tableCols] : [];
    const hasDeleteAction = this.hasDeleteActionInColumns(incomingColumns);
    const hasSelectColumn = this.hasSelectColumnInColumns(incomingColumns);

    if (hasDeleteAction && !hasSelectColumn) {
      incomingColumns.unshift({
        key: 'select',
        display: 'Select',
        sort: false,
      });
    }

    this.tableCols = incomingColumns;
  }

  // Advance Search Function

  changeSearchStatus() {
    this.showSearch = !this.showSearch;
  }
  // for column drag and drop and hide show
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.columnInfo,
      event.item.data.columnIndex,
      event.currentIndex
    );
    this.getDataKeys();
    this.emitColumns(true);
  }

  /**************     for check boxes ******************   */

  toggleSelectedColumn(columnId: string) {
    const colFound = this.columnInfo.find((col) => col.key === columnId);
    colFound.hidden = !colFound.hidden;
    this.getDataKeys();
    this.emitColumns(true);
  }

  private emitColumns(saveColumns: boolean) {
    // Only emit the columns on the next animation frame available
    window.requestAnimationFrame(() => {
      this.columnInfo
        .filter((colInfo) => !colInfo.hidden)
        .map((colInfo) => colInfo.key);
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
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
    let img: string;
    img = JSON.stringify(event.qr);
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,right=0,width=0,height=0,toolbar=0,scrollbars=0,status=0'
    );
    WindowPrt.document.write(
      '<html><head></head><body style="text-align:center; margin-top:40%" onload="window.print()">' +
      '<img  style="width:200px; height:200px" src=' +
      img +
      'alt="Red dot"  />' +
      '<p>' +
      event.lockNumber +
      '</p>' +
      '</html>'
    );
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    // WindowPrt.close();
  }

  pdfData(event) {
    let qr = event.qr;
    return {
      content: [
        {
          qr: qr,
          fit: '300',
        },
      ],
      footer: {
        columns: [
          'Device Id : ' + event.lockNumber,
          { text: 'Right part', alignment: 'left' },
        ],
      },
    };
  }

  deviceLock(lockNumber: string, result: any) {

    const params = {
      lockNumber,
      userId: this.userId.id,
      autoActionType: environment.autoLockUnlock
    };

    this.subscription.push(
      this.metroDeviceServices.deviceLock(params).subscribe((res) => {

        this.spinner.hide();

        if (res.statusCode === 200) {
          this.toastr.success('Device locked and power off for the vehicle');
          this.onDoneEvent.emit(result);
        } else {
          this.toastr.warning(res.message);
        }

      })
    );

  }

  deviceUnlock(lockNumber: string, result: any) {

    const params = {
      lockNumber,
      userId: this.userId.id,
      autoActionType: environment.autoLockUnlock
    };

    this.subscription.push(
      this.metroDeviceServices.deviceUnlock(params).subscribe((res) => {
        if (res.statusCode === 200) {
          const delayInterval = +res.data.IntervalTime;

          setTimeout(() => {
            this.powerOn(lockNumber, result);
          }, delayInterval * 1000);

        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );

  }

  powerOn(lockNumber: string, result: any, onlyPowerAction: boolean = false) {

    const params = {
      lockNumber,
      userId: this.userId.id,
      autoActionType: environment.autoLockUnlock
    };

    this.subscription.push(
      this.metroDeviceServices.powerOn(params).subscribe((res) => {

        this.spinner.hide();

        if (res.statusCode === 200) {

          if (onlyPowerAction === true) {
            this.toastr.success('Power on for the vehicle');
          } else {
            this.toastr.success('Device unlocked and power on for the vehicle');
          }

          this.onDoneEvent.emit(result);

        } else {
          this.toastr.warning(res.message);
        }

      })
    );

  }

  powerOff(lockNumber: string, result: any, onlyPowerAction: boolean = false) {

    const params = {
      lockNumber,
      userId: this.userId.id,
      autoActionType: environment.autoLockUnlock
    };

    this.subscription.push(
      this.metroDeviceServices.powerOff(params).subscribe((res) => {
        if (res.statusCode === 200) {

          if (onlyPowerAction === true) {
            this.toastr.success('Power off for the vehicle');
            this.onDoneEvent.emit(result);
          } else {

            const delayInterval = +res.data.IntervalTime;

            setTimeout(() => {
              this.deviceLock(lockNumber, result);
            }, delayInterval * 1000);

          }

        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );

  }

  actionHandler(event: any, data: any) {
    const action = event?.target?.value ?? event
    const actionData = {
      action,
      data
    };

    if (actionData.action === LOCATEBUTTON) {
      console.log(actionData, "locate")
      if (actionData.data.longitude !== '' && actionData.data.longitude !== null) {
        this.dailogRef.open(
          // ZoneMapComponent
          // LocateMapModalComponent
          // MapModalComponent
          LocateButtonModalComponent, {
            data: { pageValue: data },
            height: '100%',
            width: '1000%',
            panelClass: 'app-map-modal',
            disableClose: true  // disable outside close click on modal
        });
      }
      else {
        this.toastr.warning("Device Coordinate Not Set")
      }

    } else if (actionData.action === ENDBUTTON) {
      const dialogRef = this.dailogRef.open(PopUpComponent, {
        data: { pageValue: 'endRide', lockNumber: actionData.data },
        height: '300px',
        width: '300px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`); // Pizza!
        if (result) {
          console.log(result);
          this.onDoneEvent.emit(result);
        }
      });
    } else if (actionData.action === LOCKBUTTON) {

      // label set
      if (actionData.data.device_lock_unlock_status == 'Unlock') {
        actionData.data.label = 'lock';
      } else {
        actionData.data.label = 'unlock';
      }

      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you sure ${actionData.data.label} Vehicle ?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        // console.log(actionData);
        if (result) {

          if (environment.clientName === ClientEvegah) {
            this.setInstruction(
              actionData.data.lockNumber,
              actionData.data.label
            );
            // this.unlock =true
          } else {

            this.spinner.show();

            if (actionData.data.label === 'lock') {
              this.powerOff(actionData.data.lockNumber, result);
            } else {
              this.deviceUnlock(actionData.data.lockNumber, result);
            }

          }

        } else {
          console.log('else', actionData.action);
          // actionData.action = 'unlock'
          // this.unlock =true
        }
      });
      // this.setInstruction(actionData.data.lockNumber,'lock')
    } // For power on/off instructions
    else if (actionData.action === POWER_ON_OFF) {

      // label set
      if (+actionData.data.powerOnOffStatusEnumId === enumCodeConstants.powerOff) {
        actionData.data.label = 'Power On';
      } else {
        actionData.data.label = 'Power Off';
      }

      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Do you really want to ${actionData.data.label} the vehicle ?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (!result) {
          return;
        }

        this.spinner.show();

        if (actionData.data.label === 'Power On') {
          this.powerOn(actionData.data.lockNumber, result, true);
        } else {
          this.powerOff(actionData.data.lockNumber, result, true);
        }

      });

    }

    // For clear lock instruction
    else if (actionData.action === CLEAR_LOCK_INSTRUCTIONS) {

      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you sure to clear lock instruction?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (!result) {
          return;
        }

        this.spinner.show();

        const params = {
          lockId: actionData.data.lockId
        };

        this.subscription.push(
          this.clearInstructionService.clearLockInstructions(params).subscribe((res) => {

            this.spinner.hide();

            if (res.statusCode === 200) {
              this.toastr.success(res.message);
              this.onDoneEvent.emit(result);
            } else {
              this.toastr.warning(res.message);
            }

          })
        );

      });

    }

    // For clear light instruction
    else if (actionData.action === CLEAR_LIGHT_INSTRUCTIONS) {

      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you sure to clear light instruction?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (!result) {
          return;
        }

        this.spinner.show();

        const params = {
          lockId: actionData.data.lockId
        };

        this.subscription.push(
          this.clearInstructionService.clearLightInstructions(params).subscribe((res) => {

            this.spinner.hide();

            if (res.statusCode === 200) {
              this.toastr.success(res.message);
              this.onDoneEvent.emit(result);
            } else {
              this.toastr.warning(res.message);
            }

          })
        );

      });

    }

    // For Light On Off
    else if (actionData.action === LIGHTBUTTON) {
      console.log(action.data, 'dfdfd', actionData.data.deviceLightStatus, actionData);
      // label set
      let check = actionData.data.deviceLightStatusEnumId//deviceLightStatus.trim()
      console.log(check)
      if (check == 42) {
        console.log("if off")
        // this.unlock =true
        actionData.data.label = 'On';
      } else {
        console.log("else on")

        actionData.data.label = 'Off';
      }
      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you sure Light ${actionData.data.label} ?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`); // Pizza!
        if (result) {
          this.setLightInstruction(
            actionData.data.lockNumber,
            this.userId.id | 0,
            actionData.data.label
          );
          // this.unlock =true
          console.log('yes call api for light on off');
        } else {
          console.log('else', actionData.action);
          actionData.action = 'unlock';
          // this.unlock =true
        }
      });
      // this.setInstruction(actionData.data.lockNumber,'lock')
    }

    // For BEEP On Off
    else if (actionData.action === BEEPBUTTON) {
      console.log(action.data, 'dfdfd', actionData.data.beepStatusEnumId, actionData);
      // label set
      let check = actionData.data.beepStatusEnumId//deviceLightStatus.trim()
      console.log(check)
      if (check == 55) {
        actionData.data.label = 'On';
      } else {
        actionData.data.label = 'Off';
      }
      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you sure want Beep  ${actionData.data.label} ?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        let latLng = {
          latitude: actionData.data.latitude,
          longitude: actionData.data.longitude
        }
        if (result) {
          this.setBeepInstruction(
            actionData.data.lockNumber,
            this.userId.id | 0,
            actionData.data.label,
            latLng
          );
        } else {
          console.log('else', actionData.action);
          // this.unlock =true
        }
      });
    }

    // For Recharge Wallet
    else if (actionData.action === ADD_WALLET) {

      const dialogRef = this.dailogRef.open(RechargeWalletModalComponent, {
        data: {
          data: actionData.data,
          action: actionData.action,
          rechargeType: ADD_WALLET
        },
        height: '500px',
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (!result) {
          return;
        }

        this.spinner.hide();
        this.onDoneEvent.emit(result);

      });

    }

    // For Add Security Deposit
    else if (actionData.action === ADD_SECURITY_DEPOSIT) {

      const dialogRef = this.dailogRef.open(RechargeWalletModalComponent, {
        data: {
          data: actionData.data,
          action: actionData.action,
          rechargeType: ADD_SECURITY_DEPOSIT
        },
        height: '500px',
        width: '500px',
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (!result) {
          return;
        }

        this.spinner.hide();
        this.onDoneEvent.emit(result);

      });

    }

    // For Status Active and Deactive
    else if (actionData.action === ActiveOrDeactiveButton) {
      // console.log(action.data, actionData.data.statusEnumId, actionData);
      // label set
      let check = actionData.data.statusEnumId//deviceLightStatus.trim()
      console.log(check)
      if (check == 2) {
        actionData.data.label = 'Active';
      } else {
        actionData.data.label = 'Deactive';
      }
      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you want to sure ${actionData.data.label} Record ?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);

        if (result) {
          this.emitter.emit(actionData);
        } else {
          console.log('else', actionData.action);
        }
      });
    }

    // For Status Active and Deactive
    else if (actionData.action === Publish) {
      console.log(action.data, actionData);
      // label set
      let check = actionData.data.faqPublishStatusEnumId//deviceLightStatus.trim()
      console.log(check)
      if (check == UnublishEnumId) {
        actionData.data.label = 'Publish';
      } else {
        actionData.data.label = 'Unpublish';
      }
      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you want to sure ${actionData.data.label} FAQ " ${actionData.data.question
            } " ?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        // console.log(`Dialog result: ${result}`); 

        if (result) {
          this.emitter.emit(actionData);
        } else {
          console.log('else', actionData.action);
        }
      });
    }

    // FOR MAINTANANCE OF BIKE
    else if (actionData.action === MAINTENANCE || actionData.action === AVAILABLE) {
      const dialogRef = this.dailogRef.open(BikeMaintanceComponent, {
        data: {
          bikeData: actionData,
          pageValue: data.maintenance,
          lockNumber: data.lockNumber,
        },
        height: '400px',
        width: '400px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`); // Pizza!
        if (result) {
          console.log(result);
          this.onDoneEvent.emit(result);
        }
      });
    }

    // FOR Reply OF comments
    else if (actionData.action === REPLY) {
      if (actionData.data.commentsReplyStatusEnumId == 86) {
        this.toastr.warning("Reply Already Done")
        return
      }
      else {
        const dialogRef = this.dailogRef.open(RatingReplyComponent, {
          data: {
            bikeData: actionData,
            pageValue: data.maintenance,
            lockNumber: data.lockNumber,
          },
          height: '400px',
          width: '600px',
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`); // Pizza!
          if (result) {
            console.log(result);
            this.onDoneEvent.emit(result);
          }
        });
      }


    }

    // Withdraw
    else if (
      actionData.action === 'Withdraw' ||
      actionData.action === 'Add' ||
      actionData.action === 'Transaction'
    ) {
      this.emitter.emit(actionData);
    } else if (
      actionData.action === 'visibility' ||
      actionData.action === 'edit' ||
      actionData.action === ShiftZone ||
      actionData.action === DELETE

    ) {
      this.emitter.emit(actionData);
    }

    else if (actionData.action === HISTORY) {
      console.log(data, "check")
      this.dailogRef.open(TestLockHistoryInfoComponent, {
        data: {
            lockId: data.lockId,
            lockNumber: data.lockNumber
        },
        height: '1000px',
        width: '100%',
      });
    }

    else if (actionData.action === ReOrder) {
      console.log(data, "check")
      this.dailogRef.open(FaqReOrderComponent, {
        data: {
          lockId: data.lockId
          , lockNumber: data.lockNumber
        },
        height: '500px',
        width: '100%',
      });
    }
    else if(actionData.action === CANCELWITHDRAW){
    
      const dialogRef :any = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          bikeData: actionData,
          data: `Are you sure want to cancel Withdraw Request of  ${data.userName}?`,
          action: actionData.action,
        },
        height: '300px',
        width: '300px',
      });
     
      dialogRef.afterClosed().subscribe((result) => {
       
        if (result === true) {
          this.onDoneEvent.emit(result);
          
         
        } else {
        }
      });

    } 
    else {
      // this.emitter.emit(actionData);
      this.dailogRef.open(PopUpComponent, {
        data: { pageValue: data.qr, lockNumber: data.lockNumber },
        height: '300px',
        width: '300px',
      });
    }
  }
 
  unlock: boolean = false;
  setInstruction(bike, event) {
    console.log(event, 'lock status');
    if (event == 'lock' || event == 'Lock') {
      console.log(event, ' if lock status');
      this.setInstructionapi(bike, 3); // Lock bike
      this.unlock = true;
    } else {
      console.log(event, ' else unlock lock status');
      //this.setInstructionapi(bike.lockNumber,3)
      this.setInstructionapi(bike, 2); // unlock bike
    }
  }

  setInstructionapi(deviceid, instructionid) {
    this.subscription.push(
      this.setInstructionService
        .setInstructionToLockUnlock(deviceid, instructionid)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.unlock = true; // unlock btn active
            this.toastr.success(res.message);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }

  // for light
  setLightInstruction(bike, userId, event) {
    console.log(bike, 'userId', userId, "call", event);
    if (event === 'Off') {
      console.log("if Off api")
      this.setOffLightInstructiOnapi(bike, userId);
    } else {
      console.log("else On api")

      this.setOnLightInstructiOnapi(bike, userId);
    }
  }

  setOffLightInstructiOnapi(deviceid, userId) {
    console.log(deviceid, userId);
    let data = {
      deviceId: deviceid,
      userId: userId,
    };
    this.subscription.push(
      this.setInstructionService
        .offLightInstructionapi(data)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }

  setOnLightInstructiOnapi(deviceid, userId) {
    console.log(deviceid, userId);
    let data = {
      deviceId: deviceid,
      userId: userId,
    };
    this.subscription.push(
      this.setInstructionService
        .onLightInstructionapi(data)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }


  // For Beep ON/OFF
  setBeepInstruction(bike, userId, event, latLng) {
    console.log(bike, 'userId', userId, "call", event);
    if (event === 'Off') {
      console.log("if Off api")
      this.setOffBeepInstructiOnapi(bike, userId, latLng);
    } else {
      console.log("else On api")

      this.setOnBeepInstructiOnapi(bike, userId, latLng);
    }
  }

  setOffBeepInstructiOnapi(deviceid, userId, latLng) {
    console.log(deviceid, userId);
    let data = {
      deviceId: deviceid,
      userId: userId,
      latitude: Number(latLng.latitude),
      longitude: Number(latLng.longitude)
    };
    this.subscription.push(
      this.setInstructionService
        .offBeepInstructionapi(data)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }

  setOnBeepInstructiOnapi(deviceid, userId, latLng) {
    console.log(deviceid, userId);
    let data = {
      deviceId: deviceid,
      userId: userId,
      latitude: Number(latLng.latitude),
      longitude: Number(latLng.longitude)
    };
    this.subscription.push(
      this.setInstructionService
        .onBeepInstructionapi(data)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }


  actionHandlerTogle(a, e) {
    console.log(a, e)
    const actionData = {
      action: "toggle",
      data: e,
    };
    this.emitter.emit(actionData);
  }

  

}
function elseif(arg0: boolean) {
  throw new Error('Function not implemented.');
}

