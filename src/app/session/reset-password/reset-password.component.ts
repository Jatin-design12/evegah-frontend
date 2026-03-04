import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ResetPassword } from 'src/app/core/models/session/resetPassword-model';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  resetPasswordForm: FormGroup;
  resetPasswordModel = new ResetPassword()
  subscription: Subscription[] = [];
  constructor(public formBuilder: FormBuilder, public router: Router,
    private sessionService: SessionService, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]]
    })
  }

  onResetPassword() {
  
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }else{
      this.resetPasswordModel = this.resetPasswordForm.value;
      this.subscription.push(this.sessionService.resetPassword(this.resetPasswordModel).subscribe(res => {
        if (res.statusCode === 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        } else {
          this.toastr.warning(res.message);
        }
      }))
    } 

  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());

  }
}
