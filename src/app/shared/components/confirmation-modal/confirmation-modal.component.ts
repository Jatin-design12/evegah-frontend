import { Component, Inject, OnInit ,Input,
  Output,
  EventEmitter,
  Optional,} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { WithdrawService } from 'src/app/core/services/userTransaction/withdrawTransaction.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  
  remark:string
  static content: any;
  subscription: Subscription[] = [];
 
 
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    private  withdrawService :WithdrawService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data1: any) { }

  ngOnInit(): void {
    console.log(this.data,"data")
    console.log(this.data1, 'data');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  yesClick() {
 
    if(this.remark){
      const cancelData = { 
                            "requestId":this.data1.bikeData.data.requestId,
                            "remark":this.remark, 
                            "id":this.data1.bikeData.data.id
                          }
      this.subscription.push(this.withdrawService.cancelWithdrawTransaction(cancelData).subscribe((res:any) => {
        if(res.statusCode === 200){
          this.spinner.hide();
          this.toastr.success(res.message);
        
        } else if (res.statusCode === 422){
          this.toastr.warning(res.message)
          this.spinner.hide();
        }else{
          this.toastr.warning(res.message)
          this.spinner.hide();
        }
      }))
    }
   
    this.dialogRef.close(true);
  }
  noClick() {
    this.dialogRef.close(false);

  }
}