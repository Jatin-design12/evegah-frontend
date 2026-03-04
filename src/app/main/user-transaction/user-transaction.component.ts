import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,  NavigationExtras ,ActivatedRoute } from '@angular/router';

import { DATE_TIME_FORMAT, EDIT, LOCATEBUTTON, VIEW } from '../../core/constants/common-constant';
import { UserService } from '../../core/services/user.service';
import { TransactionService } from 'src/app/core/services/userTransaction/transaction.service';
@Component({
  selector: 'app-user-transaction',
  templateUrl: './user-transaction.component.html',
  styleUrls: ['./user-transaction.component.scss']
})
export class UserTransactionComponent implements OnInit {
  cols = [];
  subscription: Subscription[] = [];
  rowData :any= []
  transactionData = []
  constructor(private toastr: ToastrService,private transactionService: TransactionService, 
    private spinner: NgxSpinnerService ,private router :Router) { }

  ngOnInit(): void {
    this.userTransaction();
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'createdon_date',
        display: 'Transaction Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'user_name',
        display: 'User Name',
        sort: true,
      },
      {
        key: 'contact',
        display: 'Mobile No.',
        sort: true,
      },
      { 
        key: 'method',
        display: 'Txn Type',
        sort: true,
      },
      {
        key: 'amount',
        display: 'Wallet Trxn',
        sort: true,
      },
      // {
      //   key: 'extra_charges',
      //   display: 'Prev Charges',
      //   sort: true,
      // },
      {
        key: 'hiring_charges',
        display: 'Rental Charges',
        sort: true,
      },
      {
        key: 'ride_booking_min',
        display: 'Rental Hours',
        sort: true,
      }
      ,
      {
        key: 'from_ride_time',
        display: 'From Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      }
      ,
      {
        key: 'to_ride_time',
        display: 'To Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      },
      // {
      //   key: 'transactionData',
      //   display: 'Locate',
      //   sort: false,
      //   config: { 
      //       isbutton: true, actions: [LOCATEBUTTON]  },
      // },
    ]; 
   
  }
  
  userTransaction(){
    this.spinner.show();
    this.subscription.push(this.transactionService.TransactionDetails(0).subscribe((res) => {
      if(res.statusCode === 200){
          this.transactionData = (res.data || [])
            .map((element: any) => {
              const hasLocation =
                element?.rideEndLatitude != null ||
                element?.rideEndLongitude != null ||
                element?.rideStartLatitude != null ||
                element?.rideStartLongitude != null;

              let rideBookingMin = element?.ride_booking_min;
              if (rideBookingMin == null || element?.method === 'Add Amount In Wallet') {
                rideBookingMin = 'No Ride Taken';
              } else if (typeof rideBookingMin === 'string' && !rideBookingMin.includes('m')) {
                rideBookingMin = `${rideBookingMin}m`;
              }

              return {
                ...element,
                ride_booking_min: rideBookingMin,
                locationData: hasLocation,
              };
            })
            .sort((objA: any, objB: any) => +new Date(objB.createdon_date) - +new Date(objA.createdon_date));

          this.spinner.hide();
      }
      else{
          this.toastr.warning(res.message)
          this.spinner.hide();
      }
    },
    err => this.spinner.hide()
    )
    )
  }

  onActionHandler(event){
    console.log(event)
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(event)
      },  
    };
    this.router.navigate(['./main'], navigationExtras  );
   
  }
}
