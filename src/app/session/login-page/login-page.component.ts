import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { ClientEvegah, ClientMetro } from 'src/app/core/constants/common-constant';
import { Login } from 'src/app/core/models/session/login-model';
import { NewResetPassword } from 'src/app/core/models/session/newResetPassword-model';
import { CommonService } from 'src/app/core/services/common.services';
import { SessionService } from 'src/app/core/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit, OnDestroy {
  hide = true;
  loginForm: FormGroup;
  loginModel = new Login();
  subscription: Subscription[] = [];
  newResetPasswordForm:FormGroup
  newResetPasswordModel = new NewResetPassword();

  
  constructor(
    public formBuilder: FormBuilder, 
    public router: Router, 
    private sessionService: SessionService, 
    private toastr: ToastrService,
    
    ) { }
    isClient=true


  ngOnInit(): void {
    this.setFormControls();
    let clientName= environment.clientName// ClientMetro//this.commonService.checkClientName()
      if(clientName == ClientMetro){
        this.isClient =false
      }
  }

  setFormControls() {
    this.loginForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })

    this.newResetPasswordForm= this.formBuilder.group({
      newPassword:['', [Validators.required]],
      confirmPassword:['', [Validators.required]]

    })
  }

  onSubmit(): void {
   
    if (this.loginForm.invalid) {
      this.toastr.warning("Please Fill Login credentials");
      this.loginForm.markAllAsTouched();
      return;
    }else{
      const formValue = this.loginForm.value;
      this.loginModel.emailId = formValue.emailId;
       this.loginModel.password = formValue.password//sha256(formValue.password);;
      this.subscription.push(this.sessionService.adminlogin(this.loginModel).subscribe(res => {
        if (res.statusCode === 200) {
          sessionStorage.setItem('user', JSON.stringify(res.data));
          this.toastr.success(res.message);
          this.router.navigate(['/main']);
          
        } else {
          this.toastr.warning(res.message);
        }
      }))
     }
  
  }

  resetPassword() {
    if (this.newResetPasswordForm.invalid) {
      this.newResetPasswordForm.markAllAsTouched();
      return;
    }
    else {
      const formValue = this.newResetPasswordForm.value;
      console.log(formValue)
    
      this.newResetPasswordModel.password = sha256(formValue.newPassword);
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


  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

}
