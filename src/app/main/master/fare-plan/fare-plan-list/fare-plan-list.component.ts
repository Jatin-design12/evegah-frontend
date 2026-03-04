import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EDIT, VIEW } from 'src/app/core/constants/common-constant';
import { LocalServiceService } from 'src/app/core/services/local-service.service';
import { FarePlanService } from 'src/app/core/services/master/farePlan/fare-plan.service';

@Component({
  selector: 'app-fare-plan-list',
  templateUrl: './fare-plan-list.component.html',
  styleUrls: ['./fare-plan-list.component.scss']
})
export class FarePlanListComponent implements OnInit {
  heading: string ; 
  farePlanListData = [];
  cols = [];
  subscription:Subscription[]=[]

  constructor( public router: Router,public activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private farePlanService: FarePlanService,
    private storageService:LocalServiceService
    ) { }

  ngOnInit(): void {

    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      // {
      //   key: 'app_date',
      //   display: 'Applicable Date',
      //   sort: true, 
      //   config: { isDate: true, format: 'dd-MM-yyyy' }
      // },
      {
        key: 'stateName',
        display: 'State',
        sort: true,
      }, 
      {
        key: 'mapCityName',
        display: 'City',
        sort: true, 
      }, 
      {
        key: 'createdOnDate',
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

    this.getListFarePlan()
  }
  navigateToMaster(event) {
  
    // const navigationExtras: NavigationExtras = {
    //   // queryParams: {
    //   //   title: "New"
    //   // }
    // };
    this.router.navigate([`./main/master/fare-plan/fare-master`]
    // , navigationExtras
    );
  }


  getListFarePlan(){
    this.subscription.push(
      this.farePlanService
        .getFarePlanAllList()//getFareList()    //getAlllistFarePlan(0,0,0,0,0)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            console.log(this.farePlanListData,"this.farePlanListData")
            this.farePlanListData = res.data
          //   const unique = res.data.filter((obj, index) => {
          //     return index === res.data.findIndex(o => obj.cityId === o.cityId);
          // });
           
          // console.log(unique);
          //   this.farePlanListData = [...unique]
//
            // this.toastr.success(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }


  onActionHandler(event) {
    console.log('event',event)
    if (event.action === 'edit') {
    
      this.editPlan(event.data)
    } else if (event.action === 'visibility') {
      this.viewPlan(event.data)
    } 
  }
  editPlan(data) {
    data.mode = 'edit';
    console.log(data,"edit")
      // sessionStorage.setItem('fareData', JSON.stringify(data))
      this.storageService.saveDataSession('farePlan',JSON.stringify(data))
      this.router.navigate([`./main/master/fare-plan/fare-master`])
  //   sessionStorage.setItem('areaData', JSON.stringify(data))
  //   this.router.navigate([`./main/master/area/area-master`])
  // }
  }

  viewPlan(data) {
    data.mode = 'view';
    // sessionStorage.setItem('fareData', JSON.stringify(data))
    this.storageService.saveDataSession('farePlan',JSON.stringify(data))

    this.router.navigate([`./main/master/fare-plan/fare-master`])
  }
  
}
