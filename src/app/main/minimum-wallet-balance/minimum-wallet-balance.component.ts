import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { setMinimumWalletBalance } from 'src/app/core/services/setUserMinimumBalance/setuserMinIBala.service'
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DATE_TIME_FORMAT } from 'src/app/core/constants/common-constant';
@Component({
  selector: 'app-minimum-wallet-balance',
  templateUrl: './minimum-wallet-balance.component.html',
  styleUrls: ['./minimum-wallet-balance.component.scss']
})
export class MinimumWalletBalanceComponent implements OnInit {
  setMinWaalletBalForm: FormGroup;
  subscription: Subscription[] = [];
  userEnum;
  totalUpdationInminBall = [];
  cols

  public demo1TabIndex = 0;
  RidingbalanceList = [];
  SecuritybalanceList = [];
  withdrawIncompleted = [];
  requestIdArray = [];
  
  cols1 = [];
  cols2 = [];
  cols3 = [];
  date=new Date();
 // subscription: Subscription[] = [];
  constructor( private toastr: ToastrService,public formBuilder: FormBuilder, public MinimumWalletBalances : setMinimumWalletBalance ) { }

  ngOnInit(): void {
    this.cols1 = [
      // {
      //   key: 'select',
      //   display: 'All',
      //   sort: false,
      //   config: { select: false },
      // },
      {
        key: 'updatedonDate',
        display: 'Date & Time',
        sort: true,
        config: { isDate: true, format:DATE_TIME_FORMAT }
      },
      {
        key: 'updatedLoginUserName',
        display: ' Updated by ',
        sort: true,
      },
      // {
      //   key: 'walletAmount',
      //   display: 'Wallet Amount',
      //   sort: true,
      // },
      // {
      //   key: 'id',
      //   display: 'Credit Amount',//need this not in api
      //   sort: true,
      // },
      {
        key: 'enum_value',
        display: 'Updated Amount',
        sort: true,   
        // config: { isAmount: true, isClass: "'withReq'" },
      }, 
    ];
    this.cols2 = [
      // {
      //   key: 'select',
      //   display: 'All',
      //   sort: false,
      //   config: { select: true },
      // },
      {
        key: 'updatedonDate',
        display: 'Date & Time',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'updatedLoginUserName',
        display: 'Updated by',
        sort: true,
      },
      {
        key: 'enum_value',
        display: 'Updated Amount',
        sort: true,   
        // config: { isAmount: true, isClass: "'withReq'" },
      },
    ];
    this.setFormControls();
    const riding_enum_id = 107
    const security_enum_id  = 25
    this.getMinimumWalletBals(riding_enum_id);
    this.getMinimumWalletBals(security_enum_id);
    this.subscription.push(this.MinimumWalletBalances.GetEnumDetails().subscribe((res) => {
      if (res.statusCode === 200) {
        
         this.userEnum = res.data;
         
      } else if (res.statusCode === 422) {
       // this.toastr.warning(res.message)
      }
      else {
        //this.toastr.warning(res.message);
      }
    }))
  }

  setFormControls() {
    this.setMinWaalletBalForm = this.formBuilder.group({
      MinWaalletBal: 0,
    });
  
  }

  getMinimumWalletBals(id){
   
    
    this.subscription.push(this.MinimumWalletBalances.getRidingAndSecurityBal(id).subscribe((res) => {
      if (res.statusCode === 200) {
        if(id == 107){
          this.RidingbalanceList = res.data.splice(0, 10) 
        }else{
          this.SecuritybalanceList = res.data.splice(0, 5)  
        }
     
        this.totalUpdationInminBall = res.data ;
        
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
    
  }

  addMinWaalletBal(enum_id){
    
    const minbal = {
      "enum_id":enum_id ,
      "enum_value":this.setMinWaalletBalForm.value.MinWaalletBal,
      "actionByLoginUserId": JSON.parse(sessionStorage.getItem('user')).id,
      "actionByUserTypeEnumId": JSON.parse(sessionStorage.getItem('user')).user_type_enum_id
    }
    this.subscription.push(this.MinimumWalletBalances.MinimumWalletBalanceValue(minbal).subscribe((res) => {
      if (res.statusCode === 200) {
       this.toastr.success(res.message);
       if(enum_id === 107){
        this.getMinimumWalletBals(107);
       }else{
        this.getMinimumWalletBals(25);
       }
      
       this.setMinWaalletBalForm.reset()
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }
  onRowActioHandler(event){ 
    this.requestIdArray.push(Number(event.requestId));   
  }
}
