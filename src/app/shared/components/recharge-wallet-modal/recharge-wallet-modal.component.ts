import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ADD_WALLET } from 'src/app/core/constants/common-constant';
import {ADD_SECURITY_DEPOSIT}  from 'src/app/core/constants/common-constant';
import { setMinimumWalletBalance } from 'src/app/core/services/setUserMinimumBalance/setuserMinIBala.service';

import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-recharge-wallet-modal',
  templateUrl: './recharge-wallet-modal.component.html',
  styleUrls: ['./recharge-wallet-modal.component.scss']
})
export class RechargeWalletModalComponent implements OnInit, OnDestroy {

  rechargeWalletForm: any;
  subscription: Subscription[] = [];
   securityDeposite:number;
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RechargeWalletModalComponent>,
    public MinimumWalletBalances : setMinimumWalletBalance,
    private fromBuilder: FormBuilder,
    public toasterService: ToastrService,
    private userServices: UserService,
    public spinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getSecurityDeposite()
    this.initializeRechargeWalletForm();
  
  }

  initializeRechargeWalletForm() {
    this.rechargeWalletForm = this.fromBuilder.group({
      amount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      remark: ['', Validators.required],
    });
   
   
  
    
  }

  closeModal(flag: boolean = false) {
    this.dialogRef.close(flag);
  }

  getSecurityDeposite(){ 
    this.subscription.push(this.MinimumWalletBalances.getDepositAndRidingAmount().subscribe((res) => {
      if (res.statusCode === 200) {
       this.securityDeposite = res.data.minimumDepositAmoun;
       if (this.data.rechargeType === ADD_SECURITY_DEPOSIT) {
        this.rechargeWalletForm.controls['amount'].setValue(Number(this.securityDeposite));
        this.rechargeWalletForm.controls['amount'].disable()
       }
      
     
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }
  submitForm() {

    // Mark all form controls as touched to trigger validation messages
    this.rechargeWalletForm?.markAllAsTouched();

    if (this.rechargeWalletForm?.valid === false) {
      return this.toasterService.warning('Invalid form values, Please check!');
    }

    this.spinnerService.show();
   
    this.rechargeWalletForm.controls['amount'].enable()
    const { amount, remark } = this.rechargeWalletForm?.value;
  
    const params = {
      amount : Number(amount),
      receivedAmount:  Number(amount),
      id: this.data?.data.id,
      paymentTransactionId: 0,
      remark
    };

    if (this.data.rechargeType === ADD_WALLET) {
      
      this.subscription.push(
        this.userServices.rechargeWallet(params).subscribe((res) => {
          this.serviceResponseHandler(res);
        })
      );
    } else {
      this.subscription.push(
        this.userServices.addSecurityDeposit(params).subscribe((res) => {
          this.serviceResponseHandler(res);
        })
      );
    }


  }

  serviceResponseHandler(res: any) {

    this.spinnerService.hide();

    if (res.statusCode === 200) {
      this.toasterService.success('Wallet recharged successfully!');
      this.closeModal(true);
    } else {
      this.toasterService.warning(res.message);
    }

  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

}