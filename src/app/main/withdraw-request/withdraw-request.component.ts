import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Alert } from 'selenium-webdriver';
import { WithdrawService } from '../../core/services/userTransaction/withdrawTransaction.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { DatePipe } from '@angular/common'
import { SessionService } from 'src/app/core/services/session.service';
import { Router } from '@angular/router';
import { CANCELWITHDRAW, DATE_TIME_FORMAT,  } from 'src/app/core/constants/common-constant';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.scss']
})
export class WithdrawRequestComponent implements OnInit {
  total = 49004;
  withdrawInPending = [];
  withdrawInprocessing = [];
  withdrawIncompleted = [];
  withdrawCancled=[];
  requestIdArray = [];
  public demo1TabIndex = 0;

  cols1 = [];
  cols2 = [];
  cols3 = [];
  cols4 = [];
  date=new Date();
  subscription: Subscription[] = [];
  constructor(private dailogRef: MatDialog, public router: Router,  private sessionService: SessionService, 
    public datepipe: DatePipe,private toastr: ToastrService,private spinner: NgxSpinnerService ,
    private  withdrawService :WithdrawService) { }

  ngOnInit(): void {
    this.cols1 = [
      {
        key: 'select',
        display: 'All',
        sort: false,
        config: { select: true },
      },
      {
        key: 'createdOnDate',
        display: 'Date & Time',
        sort: true,
        config: { isDate: true, format:DATE_TIME_FORMAT }
      },
      {
        key: 'userName',
        display: 'Updated By',
        sort: true,
      },
      {
        key: 'contactNumber',
        display: 'Mobile No.',
        sort: true,
      },
      // {
      //   key: 'walletAmount',
      //   display: 'Wallet Amount',
      //   sort: true,
      // },
      
      {
        key: 'amount',
        display: 'Withdraw Request',
        sort: true,   
        // config: { isAmount: true, isClass: "'withReq'" },
      }, 
      {
        key: 'requestId',
        display: 'Action',//need this not in api
        sort: false,

        config: { 
          actions: [
            CANCELWITHDRAW
          ], 
          isAction: false,  
          isbutton: true,
          isClickAble: true,
        }
      },
    ];
    this.cols2 = [
      {
        key: 'select',
        display: 'All',
        sort: false,
        config: { select: true },
      },
      {
        key: 'createdOnDate',
        display: 'Date & Time',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'userName',
        display: 'Updated By',
        sort: true,
      },
      {
        key: 'contactNumber',
        display: 'Mobile No.',
        sort: true,
      },
      {
        key: 'amount',
        display: 'Withdraw Request',
        sort: true,   
        // config: { isAmount: true, isClass: "'withReq'" },
      },
    ];
    this.cols3 = [
      // {
      //   key: 'requestId',
      //   display: 'Sr. No.',
      //   sort: true, 
      // },
      {
        key: 'createdOnDate',
        display: 'Date & Time',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'userName',
        display: 'Updated By',
        sort: true,
      },
      {
        key: 'contactNumber',
        display: 'Mobile No.',
        sort: true,
      },
      {
        key: 'requestId',
        display: 'TXN ID',//need this
        sort: true,
      },
      {
        key: 'amount',
        display: 'Withdraw Request',
        sort: true,   
        // config: { isAmount: true, isClass: "'withReq'" },
      },
    ];
    this.cols4 = [
      {
        key: 'createdOnDate',
        display: 'Date & Time',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },
      {
        key: 'contactNumber',
        display: 'Mobile No.',
        sort: true,
      },
      {
        key: 'amount',
        display: 'Amount Requested',
        sort: true,   
      },
      {
        key: 'withdrawRequestStatus',
        display: 'Withdraw Status',//need this
        sort: true,
      },
    ];
    this.loadAllWithdrawLists();
  }

  
  checkUpdateForAvailable(e) {
    this.withdrawInPending = []
    this.loadAllWithdrawLists()
  }

  private loadAllWithdrawLists() {
    this.spinner.show();

    this.subscription.push(
      forkJoin({
        pending: this.withdrawService.WithdrawDetails(0, 0, 10),
        processing: this.withdrawService.WithdrawDetails(0, 0, 11),
        completed: this.withdrawService.WithdrawDetails(0, 0, 12),
        cancelled: this.withdrawService.WithdrawDetails(0, 0, 110),
      }).subscribe({
        next: (response: any) => {
          const pendingData = this.prepareWithdrawRows(response?.pending?.data || [], true, true);
          const processingData = this.prepareWithdrawRows(response?.processing?.data || [], false, true);
          const completedData = this.prepareWithdrawRows(response?.completed?.data || [], false, true);
          const cancelledData = this.prepareWithdrawRows(response?.cancelled?.data || [], false, true);

          this.withdrawInPending = pendingData;
          this.withdrawInprocessing = processingData;
          this.withdrawIncompleted = completedData;
          this.withdrawCancled = cancelledData;
          this.spinner.hide();
        },
        error: () => {
          this.toastr.warning('Unable to load withdraw lists');
          this.spinner.hide();
        },
      })
    );
  }

  private prepareWithdrawRows(data: any[], setLocation = false, sortDesc = false): any[] {
    let rows = (data || []).map((row: any) => ({
      ...row,
      ...(setLocation ? { locationData: true } : {}),
    }));

    if (sortDesc) {
      rows = rows.sort(
        (objA: any, objB: any) => +new Date(objB.createdOnDate) - +new Date(objA.createdOnDate)
      );
    }

    return rows;
  }
  
  withdrawUserListForPending(requestId,id,withdrawRequestStatusEnumId){
    this.spinner.show();
    this.subscription.push(this.withdrawService.WithdrawDetails(requestId,id,withdrawRequestStatusEnumId).subscribe((res) => {
      if(res.statusCode === 200){
        res.data.forEach((element) => {
          element.locationData = true;
        });
        res.data.sort(
          (objA, objB) =>  new Date(objB.createdOnDate).getTime() - new Date(objA.createdOnDate).getTime(),
        );
      
        this.withdrawInPending = res.data;
      
       
        this.spinner.hide();
      }else{
        this.toastr.warning(res.message)
        this.spinner.hide();
      }
    }))
  }

  withdrawUserListForprocessing(requestId,id,withdrawRequestStatusEnumId){
    this.spinner.show();
    this.subscription.push(this.withdrawService.WithdrawDetails(requestId,id,withdrawRequestStatusEnumId).subscribe((res) => {
      if(res.statusCode === 200){
          this.withdrawInprocessing = res.data;
          this.spinner.hide();
      }else{
          this.toastr.warning(res.message)
          this.spinner.hide();
      }
    }))
  }

  withdrawUserListForcompleted(requestId,id,withdrawRequestStatusEnumId){
    this.spinner.show();
    this.subscription.push(this.withdrawService.WithdrawDetails(requestId,id,withdrawRequestStatusEnumId).subscribe((res) => {
      if(res.statusCode === 200){
          res.data.reverse();
          this.withdrawIncompleted = res.data;
          this.spinner.hide();
      }else {
          this.toastr.warning(res.message)
          this.spinner.hide();
      }
    }))
  }

  withdrawCancledlist(requestId,id,withdrawRequestStatusEnumId){
    this.spinner.show();
    this.subscription.push(this.withdrawService.WithdrawDetails(requestId,id,withdrawRequestStatusEnumId).subscribe((res) => {
      if(res.statusCode === 200){
          res.data.reverse();
          this.withdrawCancled = res.data;
          this.spinner.hide();
      }else {
          this.toastr.warning(res.message)
          this.spinner.hide();
      }
    }))
  }

  processingButton(withdrawRequestStatusEnumId,event){
    console.log(event)
    this.requestIdArray = this.requestIdArray.filter((value, index) => this.requestIdArray.indexOf(value) === index);
    const WithdrawDetailsObject = {
      "requestId": this.requestIdArray,
      "withdrawRequestStatusEnumId": withdrawRequestStatusEnumId
    }
    const tabCount = 3;
    this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
    this.spinner.show();
    this.subscription.push(this.withdrawService.updateWithdrawRequestFromAdmins(WithdrawDetailsObject).subscribe((res) => {
      if(res.statusCode === 200){
          this.toastr.success(res.message);        
          this.loadAllWithdrawLists();
      }else {
          this.toastr.warning(res.message)
          this.spinner.hide();
      }
    }))
  }

  onRowActioHandler(event){ 
    this.requestIdArray.push(Number(event.requestId));   
  }
  
  clearCheckBox(){
    this.requestIdArray = [];
    this.loadAllWithdrawLists();
  }

}
