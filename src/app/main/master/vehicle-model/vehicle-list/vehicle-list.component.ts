import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router ,ActivatedRoute} from '@angular/router';
import { DELETE, EDIT, VIEW, fe_request_from_admin, DATE_TIME_FORMAT } from 'src/app/core/constants/common-constant';
import { Subscription } from 'rxjs';
import { VehicleModelService} from '../../../../core/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit {
  rowData = [ ];
  cols = [];

  is_edit_checked: boolean;
  is_view_checked: boolean;
  subscription: Subscription[] = [];
  constructor( public  activatedRoute: ActivatedRoute, private toastr: ToastrService, private spinner: NgxSpinnerService,public router: Router,public Vehicle :VehicleModelService) {}

  ngOnInit(): void {
    // this.checkAccessControl();
    this.getVehicleModelDetails()
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'vehicleTypeName',
        display: 'Vehicle Type',
        sort: true,
      },
      
      {
        key: 'modelName',
        display: 'Model Number',
        sort: true,
      },
      {
        key: 'brandName',
        display: 'Company Name',
        sort: true,
      },
      {
        key: 'breakTypeName',
        display: 'Break Type',
        sort: true,
      },
      {
        key: 'batteryTypeName',
        display: 'Battery Type',
        sort: true,
      },
      {
        key: 'batteryCapacityVolt',
        display: 'Battery Capacity (Volt)',
        sort: true,
      },
      {
        key: 'batteryCapacityAh',
        display: 'Battery Capacity (Ah)',
        sort: true,
      },
     
      {
        key: 'asaccesarriesName',
        display: 'Accessories',
        sort: true,
      },
      {
        key: 'frameTypeName',
        display: 'Frame Type',
        sort: true,
      },
      {
        key: 'color',
        display: 'Color',
        sort: true,
      },
      {
        key: 'motorType',
        display: 'Motor Type',
        sort: true,
      },
      {
        key: 'maxRangeOn100PercentageBatteryKM',
        display: 'Max. range on 100% Battery in (KM)',
        sort: true,
      },
      
      {
        key: 'createdonDate',
        display: 'Created Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT },
      },
      {
        key: 'updatedOnDate',
        display: 'Update Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT },
      },
    
     
      // {
      //   key: 'minimumRentRate',
      //   display: 'Minimum Rate',
      //   sort: true,
      // },
       {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [EDIT] },
      }
    ];

 
  }

  getVehicleModelDetails() {
    this.spinner.show();
    let obj = {
      vehicleId:0,
      option:'VehicleModelList',
      add:'view',
      req:fe_request_from_admin,
      pageName:'VehicleListComponent'
    }
    this.subscription.push(this.Vehicle.getVehicleModelListDetailsForTable(obj).subscribe((res) => {
      if(res.statusCode === 200){
        res.data.forEach(e=>{
          if(e.breakTypeNameJson !== null){
            e.breakTypeName = e.breakTypeNameJson.map(e=>e.Name).toString()
          }
           if (e.batteryTypeNameJson !== null){
            e.batteryTypeName = e.batteryTypeNameJson.map(e=>e.Name).toString()
          }
           if (e.asaccesarriesNameJson !== null){
            e.asaccesarriesName = e.asaccesarriesNameJson.map(e=>e.Name).toString()
          }
          
        })
        this.rowData = res.data;
        this.spinner.hide();
      }else{
        this.toastr.warning(res.message)
        this.spinner.hide();
      }
    }))
    
  }
  navigateToMaster(event) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        title: "New"
      }
    };
    this.router.navigate([`./main/master/vehicle/vechile-master`], navigationExtras);
  }

  onActionHandler(event) {
    if (event.action === 'edit') {
      console.log(event,"call")
      let obj = {
        vehicleId:event.data.vehicleId,
        option:'VehicleModelList',
        add:'view',
        req:fe_request_from_admin,
        pageName:'VehicleListComponent'
      }

      let sentData={}
      this.subscription.push(this.Vehicle.getVehicleModelListDetails(obj).subscribe((res) => {
        if(res.statusCode === 200){
          sentData= res.data[0];
           console.log(res.data)
           const navigationExtras: NavigationExtras = {
            queryParams: {
              title: "edit",
              data: JSON.stringify(sentData)
            }
          };
          this.router.navigate([`./main/master/vehicle/vechile-master`], navigationExtras);
          this.spinner.hide();
        }else{
          this.toastr.warning(res.message)
          this.spinner.hide();
        }
      }))
      

    } 
    else if (event.action === 'visibility') {
      
      const navigationExtras: NavigationExtras = {
        queryParams: {
          title: "view",
          data: JSON.stringify(event.data)
        }
      };
      this.router.navigate([`./main/master/vehicle/vechile-master`], navigationExtras);
    }
  }
}
