import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IBookingListData } from 'src/app/core/interfaces/booking-data/list-data';
import { BookingDataService } from 'src/app/core/services/booking-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-booking-data-list',
  templateUrl: './booking-data-list.component.html',
  styleUrls: ['./booking-data-list.component.scss']
})
export class BookingDataListComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  rowData: IBookingListData[] = [];
  cols = [];
  constructor(private bookingDataService: BookingDataService, 
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getTableColumns();
    this.getBookingDataList();
  }
  getTableColumns() {
    this.cols = [
      {
        key: 'sno', display: 'S.no', sort: false, config: { isIndex: true }

      },
      {
        key: 'actualRideTime', display: 'Date', sort: true, config: { isDate: true, format: 'dd-MM-yyyy' }

      },
      {
        key: 'userName', display: 'User  Name', sort: true, 

      },
      {
        key: 'paymentDetails', display: 'Contact Number', sort: true, config: { isInner: true,innerKey: 'contact'}

      },
      {
        key: 'minWalletAmount', display: 'Wallet  Txn', sort: true, 

      },
      {
        key: 'perviousCharges', display: 'Pervious Charge', sort: true, 

      },
      {
        key: 'hiringCharges', display: 'Rental Charge', sort: true, 

      },
      {
        key: 'rideBookingMinutes', display: 'Rental Hours', sort: true,  

      },
      {
        key: 'fromRideTime', display: 'From Time', sort: true,  config: { isDate: true, format: 'shortTime' }

      },
      {
        key: 'toRideTime', display: 'To Time', sort: true, config: { isDate: true, format: 'shortTime' }

      },
    ]
  }

  getBookingDataList() {
    this.spinner.show();
    this.subscription.push(this.bookingDataService.getBookingDataList(0, 0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.rowData = res.data;
        this.rowData.sort((x,y)=>+new Date(y.actualRideTime) - +new Date(x.actualRideTime))
        this.spinner.hide();
      } else {
        this.toastr.warning(res.message)
      }
    }))
  }

  onActionHandler(event) {
    if (event.action === 'edit') {
      // this.editData = event.data;
      // this.openModal('edit')
    } else if (event.action === 'visibility') {
      // this.viewPurity(event.data)
    }
  }
  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
