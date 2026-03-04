import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';

@Component({
  selector: 'app-qr-model',
  templateUrl: './qr-model.component.html',
  styleUrls: ['./qr-model.component.scss']
})
export class QrModelComponent implements OnInit {

  qrNumber:any =''
  subscription:Subscription[]=[]
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor(
    public dialogRef: MatDialogRef<QrModelComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public ProduceBikeService :ProduceBikeService,
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.qrNumber= this.data.qrNumber
  }
  
  save(){
    this.data.qrNumber = this.qrNumber 
    this.addUpdateBikeProduce()
  }

  addUpdateBikeProduce(){
    let data:any = {
      "bikeProduceId": this.data.id,
      "actionByLoginUserId":this.user.id,
      "qrNumber":this.qrNumber 
    }
   
    this.spinner.show()
    this.subscription.push(this.ProduceBikeService.addUpdateBikeProduce(data).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.dialogRef.close(true);
        this.spinner.hide()
        
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
        this.spinner.hide()
      }
      else {
        this.toastr.warning(res.message);
        this.spinner.hide()
      }
    },
    (err)=>  this.spinner.hide()
    ))
  }

  closemodel() {
    this.dialogRef.close(false);
  }
}
