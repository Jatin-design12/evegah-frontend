import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from 'src/app/core/services/session.service';
import { NewResetPassword } from 'src/app/core/models/session/newResetPassword-model'
import { sha256 } from 'js-sha256';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { MustMatch } from 'src/app/core/helper/common-helper';




@Component({
  selector: 'app-new-reset-password',
  templateUrl: './new-reset-password.component.html',
  styleUrls: ['./new-reset-password.component.scss']
})
export class NewResetPasswordComponent implements OnInit, OnDestroy {
  newResetPasswordForm: FormGroup;
  newResetPasswordModel = new NewResetPassword();
  subscription: Subscription[] = [];

  constructor(public formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router, private sessionService: SessionService,
    private activatedRoute: ActivatedRoute) {
    this.newResetPasswordModel.token = this.activatedRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.newResetPassword();

  }
  newResetPassword() {
    this.newResetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required, Validators.minLength(6)]
    }, 
    {
      validator: MustMatch('newPassword', 'confirmPassword')

    }
    );
  }

  resetPassword() {
    if (this.newResetPasswordForm.invalid) {
      this.newResetPasswordForm.markAllAsTouched();
      return;
    }
    else {
      const formValue = this.newResetPasswordForm.value;
      this.newResetPasswordModel.password =formValue.newPassword //sha256(formValue.newPassword);
      this.subscription.push(this.sessionService.newResetPassword(this.newResetPasswordModel).subscribe(res => {
        if (res.statusCode === 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        }
        else {
          this.toastr.warning(res.message)
        }
      }))

    }

  }


  gotoAdmin(){
    this.router.navigate(['/main'])
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());

  }
}





