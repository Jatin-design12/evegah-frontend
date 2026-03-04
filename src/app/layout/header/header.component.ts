//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================


import { Component, OnInit, } from '@angular/core';
import { DataShareService } from 'src/app/core/services/data-sharing.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { Login } from 'src/app/core/models/session/login-model';
import { SessionService } from 'src/app/core/services/session.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  sidebar = true
  notificationCount = 0;
  subscription: Subscription[] = [];
  
  constructor(
    public dataSharingService: DataShareService,
    public formBuilder: FormBuilder, 
    public router: Router, 
    private sessionService: SessionService, 
    private toastr: ToastrService,
    ) { }
  ngOnInit(): void {

  }

  burgerClick() {
    this.sidebar = !this.sidebar
    this.dataSharingService.sidebarCollapsed(this.sidebar)
  }

  logOut() {
    this.subscription.push(this.sessionService.adminlogOut().subscribe(res => {
      if (res.statusCode === 200) {
      
        this.toastr.success(res.message);
        sessionStorage.clear();
        localStorage.clear()
        this.router.navigate(['/login']);
        
      } else {
        this.toastr.warning(res.message);
      }
    }))
   
   
  } 
  
}

