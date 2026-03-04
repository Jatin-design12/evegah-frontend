import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-wallet-details',
  templateUrl: './user-wallet-details.component.html',
  styleUrls: ['./user-wallet-details.component.scss']
})
export class UserWalletDetailsComponent implements OnInit {
  heading: string ;
  totalWalletAmount:number = 10
  transctionDetailOfPerticularUser = [];
  cols = [];
  totalcreditAmount:number = 9000
  constructor(public router: Router,public activatedRoute: ActivatedRoute) { }
 
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log( JSON.parse(params.data))
      this.totalWalletAmount = JSON.parse(params.data).walletAmount
      this.heading = JSON.parse(params.data).userName;
      this.transctionDetailOfPerticularUser = JSON.parse(params.data).transactionDetails;
    });
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'created_at',
        display: 'Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy' }
      },
      {
        key: 'createdon_date',
        display: 'Time',
        sort: true,
        config: { isDate: true, format: 'shortTime' }
      },
      {
        key: 'description',
        display: 'Details',
        sort: true,
      },
      {
        key: 'payment_id',
        display: 'Transaction id',
        sort: true,
      },
      {
        key: 'method',
        display: 'Trxn type',
        sort: true,
      },
      {
        key: 'amount',
        display: 'Amount',
        sort: true,
      },
      // {
      //   key: 'action',
      //   display: 'Action',
      //   sort: false,
      //   config: { isAction: true, actions: [VIEW] },
      // },
    ]; 
  }
  onActionHandler(event){
    this.router.navigate(['./main/user-wallet-details'])
    }
    backButton() {
      this.router.navigate(['./main/user-wallet']);
    }
}
