import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { DATE_TIME_FORMAT, EDIT, TRANSACTION, VIEW, ADD_WALLET, ClientMetro, ADD_SECURITY_DEPOSIT } from './../../../core/constants/common-constant';
import { UserService } from '../../../core/services/user.service';
import { UserTansactionDetailComponent } from 'src/app/shared/components/user-tansaction-detail/user-tansaction-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  rowData = [];
  cols = [];
  subscription: Subscription[] = [];
  isTableRefreshing = false;
  private readonly userCacheKey = 'admin_user_details_cache_v1';
  private readonly userSyncTokenKey = 'admin_user_details_sync_token_v1';

  constructor(private toastr: ToastrService, private userService: UserService,
    private spinner: NgxSpinnerService, private dailogRef: MatDialog,) { }

  ngOnInit(): void {
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
        display: 'Mobile No.',
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
        key: 'address',
        display: 'Address',
        sort: true,
      },
      {
        key: 'cityName',
        display: 'City',
        sort: true,
      },
      {
        key: 'stateName',
        display: 'State',
        sort: true,
      },

      {
        key: 'createdOnDate',
        display: 'Registration Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },

      {
        key: 'userLastRideDateTime',
        display: 'Last Ride ',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isbutton: true, actions: [TRANSACTION, ADD_WALLET] },
      },
    ];

    this.getUserLists();

    // show ADD_SECURITY_DEPOSIT control only for metro client
    if (environment.clientName === ClientMetro) {
      let actionsCell = this.cols[this.cols.length - 1];
      actionsCell?.config?.actions?.push(ADD_SECURITY_DEPOSIT);
    }

  }

  getUserLists() {
    this.spinner.show();
    this.triggerTableRefreshAnimation();
    const cachedRows = this.getCachedUsers();

    if (cachedRows.length > 0) {
      this.rowData = this.normalizeUserRows(cachedRows);
    }

    this.subscription.push(this.userService.getUserList(0, 1).subscribe((res: any) => {
      if (res?.statusCode === 200) {
        this.rowData = this.normalizeUserRows(res.data || []);
        this.triggerTableRefreshAnimation();
        this.cacheUsers(this.rowData);
        this.spinner.hide();
      } else {
        if (cachedRows.length === 0) {
          this.toastr.warning(res?.message || 'Unable to load users');
        }
        this.spinner.hide();
      }
    }, () => {
      if (cachedRows.length === 0) {
        this.toastr.error('Unable to load users');
      }
      this.spinner.hide();
    }))
  }

  private normalizeUserRows(rows: any[]): any[] {
    return (rows || [])
      .map((element: any) => ({
        ...element,
        transctionValue: 0,
        walletAmount: Math.floor(Number(element.walletAmount) || 0),
        locationData: true,
      }))
      .sort((x: any, y: any) => +new Date(y.createdOnDate) - +new Date(x.createdOnDate));
  }

  private mergeUserRows(existingRows: any[], deltaRows: any[]): any[] {
    const userMap = new Map<number, any>();
    (existingRows || []).forEach((row: any) => userMap.set(Number(row.id), row));
    (deltaRows || []).forEach((row: any) => userMap.set(Number(row.id), row));
    return Array.from(userMap.values());
  }

  private getCachedUsers(): any[] {
    try {
      const cachedValue = localStorage.getItem(this.userCacheKey);
      return cachedValue ? JSON.parse(cachedValue) : [];
    } catch {
      return [];
    }
  }

  private cacheUsers(rows: any[]): void {
    localStorage.setItem(this.userCacheKey, JSON.stringify(rows || []));
  }

  private getSyncToken(): string {
    return localStorage.getItem(this.userSyncTokenKey) || '';
  }

  private setSyncToken(syncToken: string): void {
    localStorage.setItem(this.userSyncTokenKey, syncToken);
  }

  private triggerTableRefreshAnimation(): void {
    this.isTableRefreshing = true;
    setTimeout(() => {
      this.isTableRefreshing = false;
    }, 220);
  }
  onActionHandler(event) {
    console.log(event);
    if (event.action === 'Transaction') {
      this.transaction(event.data);
    }
  }
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

  handleDoneEvent(event) {
    this.getUserLists();
  }
}
