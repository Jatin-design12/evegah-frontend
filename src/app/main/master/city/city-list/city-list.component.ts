import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EDIT, VIEW } from 'src/app/core/constants/common-constant';
import { CityMasterService } from 'src/app/core/services/master/city/city-master.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
  cityList = [];
  cols= []; 
  subscription:Subscription[]=[]
  cityData=[]
  constructor(public router: Router,public activatedRoute: ActivatedRoute,
    private toastr: ToastrService, private spinner: NgxSpinnerService,
  //  private AreaService:AreaService,
   private cityService:CityMasterService,
   ) { }

  ngOnInit(): void {
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'userCityName',
        display: 'Map City Name',
        sort: true,
      }, 
      {
        key: 'mapCityName',
        display: 'City Name',
        sort: true,
      }, 
      {
        key: 'mapStateName',
        display: 'State',
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
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a'},
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [EDIT, VIEW] },
      },
    ]

    this.getAllCityList()
  }
  // navigateToMaster(event) {
  //   this.router.navigate(['./main/master/city/city-master'])
  // }


  navigateToMaster(event) {
  
    const navigationExtras: NavigationExtras = {
      queryParams: {
        title: "New"
      }
    };
    this.router.navigate([`./main/master/city/city-master`], navigationExtras);
  }

  getAllCityList(){
    this.spinner.show();
    this.subscription.push(this.cityService.getCityMaterList().subscribe(res=>{
      if (res.statusCode === 200) {
        this.cityData = res.data
        console.log(this.cityData,"areaData")
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
    console.log('event',event, event.data.mapCityId)
    this.getCityDetailByMap(event.data.mapCityId,event)
    // if (event.action === 'edit') {
    //   this.editOrder(event.data)
    // } else if (event.action === 'visibility') {
    //   this.viewOrder(event.data)
    // } 
  }


  editOrder(data) {
    data.mode = 'edit';
    console.log(data,"edit")
      sessionStorage.setItem('areaData', JSON.stringify(data))
      this.router.navigate([`./main/master/city/city-master`])
  //   sessionStorage.setItem('areaData', JSON.stringify(data))
  //   this.router.navigate([`./main/master/area/area-master`])
  // }
  }

  viewOrder(data) {
    data.mode = 'view';
    sessionStorage.setItem('areaData', JSON.stringify(data))
    this.router.navigate([`./main/master/city/city-master`])
  }

  onRowActioHandler($event){

  }
  cityDetailData:any=[]
  getCityDetailByMap(id,event){
    this.subscription.push(this.cityService.getCityMapDetailById(id).subscribe(res=>{
      if (res.statusCode === 200) {
        this.cityDetailData = res.data
        console.log(this.cityDetailData,"areaData")


        if (event.action === 'edit') {
          this.editOrder(this.cityDetailData[0])
        } else if (event.action === 'visibility') {
          this.viewOrder(this.cityDetailData[0])
        } 
        // this.toastr.success(res.message);
      }
      else{
        // this.toastr.warning(res.message);
        // this.spinner.hide()

      }
    }))
  }
}
