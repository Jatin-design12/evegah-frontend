import { Component, OnInit, Optional,Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { fe_action_add, fe_request_from_admin } from 'src/app/core/constants/common-constant';
import { ModelRideRating } from 'src/app/core/models/user/ride-rating-Model';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-rating-reply',
  templateUrl: './rating-reply.component.html',
  styleUrls: ['./rating-reply.component.scss']
})
export class RatingReplyComponent implements  OnInit {

  constructor( private dashboardService:DashboardService,
    private toastr: ToastrService, public dialogRef: MatDialogRef<RatingReplyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private userService:UserService
    ) { }

    remark:any=''
    subscription:Subscription[]=[]
    rideModel= new  ModelRideRating()
  ngOnInit(): void {
    console.log(this.data,"data")
  }

  save(){
    this.rideModel.rideBookingId = this.data.bikeData.data.rideBookingId
    this.rideModel.rideCommentsReply = this.remark
    this.rideModel.add = fe_action_add;
    this.rideModel.req = fe_request_from_admin;
    this.rideModel.pageName = 'RatingReplyComponent';
    this.rideModel.option = 'RatingReplyModal';
      this.subscription.push(this.userService.addRidebookingCommentsReply(this.rideModel).subscribe(res=>{
        if(res.statusCode == 200){
              this.toastr.success(res.message)
              this.dialogRef.close(true)
        }else{

          this.toastr.warning(res.message)
          this.dialogRef.close(false)
        }
      }))
    
    
    // this.dialogRef.close(true)

    }
   
    closemodel(){
      this.dialogRef.close(false)
    }
  
}

