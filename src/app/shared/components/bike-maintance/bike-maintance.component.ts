import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { maintanceBikeModel } from 'src/app/core/models/dashboard/bikeMaintaintenceModel';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { DashboardComponent } from 'src/app/main/dashboard/dashboard.component';

@Component({
  selector: 'app-bike-maintance',
  templateUrl: './bike-maintance.component.html',
  styleUrls: ['./bike-maintance.component.scss'],
  // standalone: true,
  // imports: [FormsModule, MatFormFieldModule, MatInputModule],
})
export class BikeMaintanceComponent implements OnInit {
  constructor(
    private dashboradService: DashboardService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<BikeMaintanceComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  remark: any = '';
  subscription: Subscription[] = [];
  bikeModel = new maintanceBikeModel();
  ngOnInit(): void {
    console.log(this.data, 'data');
  }

  save(call) {
    this.bikeModel.bikeId = this.data.bikeData.data.id;
    this.bikeModel.deviceId = this.data.bikeData.data.lockNumber;

    this.bikeModel.userId = this.data.id || 31;
    this.bikeModel.remarks = this.remark;
    console.log(this.bikeModel);
    if (call == 'maintenance') {
      this.subscription.push(
        this.dashboradService
          .bikeUndermaintenance(this.bikeModel)
          .subscribe((res) => {
            if (res.statusCode == 200) {
              this.toastr.success(res.message);
              this.dialogRef.close(true);
            } else {
              this.toastr.warning(res.message);
              this.dialogRef.close(false);
            }
          })
      );
    } else {
      this.subscription.push(
        this.dashboradService
          .bikeUnresurved(this.bikeModel)
          .subscribe((res) => {
            if (res.statusCode == 200) {
              this.toastr.success(res.message);
              this.dialogRef.close(true);
            } else {
              this.toastr.warning(res.message);
              this.dialogRef.close(false);
            }
          })
      );
    }
    this.dialogRef.close(true);
  }

  closemodel() {
    this.dialogRef.close(false);
  }
}
