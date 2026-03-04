import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EDIT, VIEW } from 'src/app/core/constants/common-constant';
import { AreaService } from 'src/app/core/services/master/area/area.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss']
})
export class AreaListComponent implements OnInit {
  heading: string ;
  totalWalletAmount:number = 10
  transctionDetailOfPerticularUser = [];
  cols = [];
  areaData=[]
  subscription:Subscription[]=[]
  constructor(public router: Router,public activatedRoute: ActivatedRoute,
    private toastr: ToastrService, private spinner: NgxSpinnerService,
   private AreaService:AreaService) { }

  ngOnInit(): void {

    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'name',
        display: 'Area Name',
        sort: true,
        // config: { isDate: true, format: 'dd-MM-yyyy' }
      },
      {
        key: 'areaType',
        display: 'Area Type',
        sort: true,
      },
      {
        key: 'mapCityName',
        display: 'City',
        sort: true,
        // config: { isDate: true, format: 'shortTime' }
      },
      {
        key: 'mapStateName',
        display: 'State',
        sort: true,
      }, 
      {
        key: 'createdDate',
        display: 'Create Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'updatedOnDate',
        display: 'Update Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [EDIT, VIEW] },
      },
    ]; 

    this.getAllAreaList()
  }
  navigateToMaster(event) {
  
    const navigationExtras: NavigationExtras = {
      queryParams: {
        title: "New"
      }
    };
    this.router.navigate([`./main/master/area/area-master`], navigationExtras);
  }

  getAllAreaList(){
    this.spinner.show();
    this.subscription.push(this.AreaService.getAreaDetailByCityId(0,0,0).subscribe(res=>{
      if (res.statusCode === 200) {
        this.areaData = res.data
        console.log(this.areaData,"areaData")
        this.spinner.hide()
        // this.toastr.success(res.message);
      }
      else{
        this.toastr.warning(res.message);
        this.spinner.hide()

      }
    }))
  }

  onActionHandler(event) {
    console.log('event',event)
    if (event.action === 'edit') {
      this.editOrder(event.data)
    } else if (event.action === 'visibility') {
      this.viewOrder(event.data)
    } 
  }
  editOrder(data) {
    data.mode = 'edit';
    console.log(data,"edit")
      sessionStorage.setItem('areaData', JSON.stringify(data))
      this.router.navigate([`./main/master/area/area-master`])
  //   sessionStorage.setItem('areaData', JSON.stringify(data))
  //   this.router.navigate([`./main/master/area/area-master`])
  // }
  }

  viewOrder(data) {
    data.mode = 'view';
    sessionStorage.setItem('areaData', JSON.stringify(data))
    this.router.navigate([`./main/master/area/area-master`])
  }

  onRowActioHandler(data){

  }
}
