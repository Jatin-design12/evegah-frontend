import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Console } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  ADDAMOUNT,
  ADDCREDIT,
  ADD_WALLET,
  MAINTENANCE,
  TRANSACTION,
  WITHDRAW,
} from 'src/app/core/constants/common-constant';
import { UserService } from '../../../app/core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddWithdrawModelComponent } from 'src/app/shared/components/add-withdraw-model/add-withdraw-model.component';
import { UserTansactionDetailComponent } from 'src/app/shared/components/user-tansaction-detail/user-tansaction-detail.component';
import { UserWalletDetailsComponent } from '../user-wallet-details/user-wallet-details.component';
@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss'],
})
export class UserWalletComponent implements OnInit {
  panelOpenState: boolean = false;

  userWallet = [];
  cols = [];
  subscription: Subscription[] = [];
  constructor(
    private toastr: ToastrService,
    private dailogRef: MatDialog,
    public router: Router,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    // private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.userWalletList();
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },
      {
        key: 'mobile',
        display: 'Contact Number',
        sort: true,
      },
      {
        key: 'emailId',
        display: 'Email',
        sort: true,
      },
      {
        key: 'walletAmount',
        display: 'Wallet Amount',
        sort: true,
      },
      {
        key: 'credit',
        display: 'Credit Amount',
        sort: true,
      },
      {
        key: 'createdbyLoginUserId',
        display: 'Action',
        sort: false,
        config: {
          isbutton: true, actions: [
            // ADDAMOUNT,
            TRANSACTION]
        },
      },
      // {
      //   key: 'credits',
      //   display: 'Action',
      //   sort: true,config: {
      //     actions: [ADDWALLET,ADDCREDIT] ,
      //     isbutton:true,
      //     isClickAble:true
      //   },

      //   },
    ];
  }

  userWalletList() {
    this.spinner.show();
    this.subscription.push(
      this.userService.getUserList(0, 0).subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.userWallet = res.data;

          console.log(this.userWallet);

          this.spinner.hide();
        } else {
          this.toastr.warning(res.message);
          this.spinner.hide();
        }
      })
    );
  }

  rowclick(event) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(event),
      },
    };
    // this.router.navigate(['./main/user-wallet-details'], navigationExtras);
  }

  onActionHandler(event) {
    // console.log(event);

    if (event.action === 'Add') {
      this.Add(event.data);
    } else if (event.action === 'Withdraw') {
      this.withdraw(event.data);
    }
    else if (event.action === 'Transaction') {
      this.transaction(event.data);
    }
  }

  Add(e) {
    console.log('add');
    // this.dialogRef.close({ refreshing: true })
    this.openDialog(e);
  }

  withdraw(e) {
    console.log('Withdraw');
    this.openDialog(e);
  }

  toDate = new Date()
  transaction(e) {
    // console.log('Transaction');
    this.openDialogTansaction(e);
  }

  openDialogTansaction(e) {
    const dialogRef = this.dailogRef.open(
      UserTansactionDetailComponent
      , {
        data: e,
        height: '800px',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`); // Pizza!
      if (result) {
        // console.log(result);
        // dialogRef.close({ refreshing: true })
      }
    });

  }


  openDialog(e) {
    const dialogRef = this.dailogRef.open(AddWithdrawModelComponent, {
      data: e,
      height: '400px',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`); // Pizza!
      if (result) {
        console.log(result);
        // dialogRef.close({ refreshing: true })
      }
    });
  }
}
