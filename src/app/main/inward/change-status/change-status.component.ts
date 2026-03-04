import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LockService } from 'src/app/core/services/lockInward/lockInward.service'
@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  btnLabel: string
  lockUnlockObj: any = {}
  constructor(public dialogRef: MatDialogRef<ChangeStatusComponent>, private LockService: LockService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (Number(this.data.data.statusEnumId) === 1) {
      this.btnLabel = 'Unlock'
      this.lockUnlockObj.statusEnumId = 2
    } else {
      this.btnLabel = 'Lock'
      this.lockUnlockObj.statusEnumId = 1
    }
    this.lockUnlockObj.lockInwardId = Number(this.data.data.lockInwardId)
  }


  changeLock() {
    this.subscription.push(this.LockService.changeLockStatus(this.lockUnlockObj).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message)
        
      } else {
        this.toastr.warning(res.message)
      }
      this.dialogRef.close({ refreshing: true })
    }))
  }
  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
