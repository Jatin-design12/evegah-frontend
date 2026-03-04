import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ToastrService } from 'ngx-toastr';
import { setMinimumWalletBalance } from 'src/app/core/services/setUserMinimumBalance/setuserMinIBala.service';
@Component({
  selector: 'app-version-update',
  templateUrl: './version-update.component.html',
  styleUrls: ['./version-update.component.scss']
})
export class VersionUpdateComponent implements OnInit {
    updatedVresionlist = [];
    cols = [];
    subscription: Subscription[] = [];
    constructor( public MinimumWalletBalances : setMinimumWalletBalance,private toastr: ToastrService,public router: Router,public activatedRoute: ActivatedRoute) { }
    ngOnInit(){

      this.cols = [
        {
          key: 'sno',
          display: 'S.No.',
          sort: false,
          config: { isIndex: true },
        },
        {
          key: 'updatedOnDate',
          display: 'Date',
          sort: true,
          config: { isDate: true, format: 'dd-MM-yyyy' }
        },
        {
          key: 'displayVersion',
          display: 'Display Version',
          sort: true,
        },
        {
          key: 'actualVersion',
          display: 'Version Code',
          sort: true,
        },
        
        {
          key: 'minSupportableVersion',
          display: 'Min. Supportable Version',
          sort: true,
        },
        {
          key: 'remark',
          display: 'Remark',
          sort: true,
        },
        // {
        //   key: 'action',
        //   display: 'Action',
        //   sort: false,
        //   config: { isAction: true, actions: [VIEW] },
        // },
      ]; 
      this.getVersionUpdate();
    }

    getVersionUpdate(){
      this.subscription.push(this.MinimumWalletBalances.getVesionUpdateList().subscribe((res) => {
        if (res.statusCode === 200) {
          this.updatedVresionlist = res.data
        } else if (res.statusCode === 422) {
          this.toastr.warning(res.message)
        }else {
          this.toastr.warning(res.message);
        }
      }))
    }
  
}
