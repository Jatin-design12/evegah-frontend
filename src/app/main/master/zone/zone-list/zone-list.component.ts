import { EDIT, VIEW } from './../../../../core/constants/common-constant';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { CategoryService } from 'src/app/core/services/inventory/category-services';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.services';
import { ZoneService } from 'src/app/core/services/zone.service'
@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
})
export class ZoneListComponent implements OnInit {
  rowData = [];
  cols = [];
  subscription: Subscription[] = [];
  is_add_checked: boolean;
  is_view_checked: boolean;
  is_edit_checked: boolean;
  checkAccessControl: any;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private zoneService: ZoneService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

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
        display: 'Zone Name',
        sort: true,
      },
      {
        key: 'areaName',
        display: 'Area',
        sort: true,
      },
      {
        key: 'areaTypeName',
        display: 'Area Type',
        sort: true,
      },
      {
        key: 'cityName',
        display: 'City Name',
        sort: true,
      },
      {
        key: 'stateName',
        display: 'State',
        sort: true,
      },
      {
        key: 'zoneSize',
        display: 'Zone Size ( Sq. ft.)',
        sort: true,
      },
      {
        key: 'zoneCapacity',
        display: 'Zone Capacity',
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

    
     this.getZoneList();
  }

  // getCategoryList() {
  //   this.spinner.show();
  //   this.subscription.push(this.categoryService.getCategoryList(0).subscribe((res) => {
  //     if(res.statusCode === 200){
  //       this.rowData = res.data;
  //       this.spinner.hide();
  //     }else{
  //       this.toastr.warning(res.message)
  //       this.spinner.hide();
  //     }
  //   }))
  // }
  getZoneList() {
    this.spinner.show();
    this.subscription.push(this.zoneService.getZoneList(0,0).subscribe((res) => {
      if(res.statusCode === 200){
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
    this.router.navigate([`./main/master/zone/zone-master`], navigationExtras);
  }

  onActionHandler(event) {
    if (event.action === 'edit') {

      const navigationExtras: NavigationExtras = {
        queryParams: {
          title: "edit",
          data: JSON.stringify(event.data)
        }
      };
      this.router.navigate([`./main/master/zone/zone-master`], navigationExtras);

    } else if (event.action === 'visibility') {
      
      const navigationExtras: NavigationExtras = {
        queryParams: {
          title: "view",
          data: JSON.stringify(event.data)
        }
      };
      this.router.navigate([`./main/master/zone/zone-master`], navigationExtras);
    }
  }
  editZone(data) {
    data.mode = 'edit';
    sessionStorage.setItem('Zone', JSON.stringify(data))
    this.router.navigate(['./main/master/zone/zone-master'])
  }

  viewZone(data) {
    data.mode = 'view';
    sessionStorage.setItem('Zone', JSON.stringify(data))
    this.router.navigate(['./main/master/zone/zone-master'])
  }

  // checkAccessControl(){
  //   let module= userAccess.INVENTORYNAME;
  //   let page = userAccess.INVENTORY.CATEGORY;
  //   // let action = ;
  //   this.is_add_checked = this.commonService.checkUserAccessControlForAction(module, page, userAccess.ACTIONS.ADD);
  //   this.is_edit_checked = this.commonService.checkUserAccessControlForAction(module, page, userAccess.ACTIONS.EDIT);
  //   this.is_view_checked = this.commonService.checkUserAccessControlForAction(module, page, userAccess.ACTIONS.VIEW);
  // }


  // onActionHandler(event) {
  //   console.log('event',event)
  //   if (event.action === 'edit') {
  //     this.editOrder(event.data)
  //   } else if (event.action === 'visibility') {
  //     this.viewOrder(event.data)
  //   } 
  // }
  // editOrder(data) {
  //   data.mode = 'edit';
  //   console.log(data,"edit")
  //     sessionStorage.setItem('zoneData', JSON.stringify(data))
  //     this.router.navigate(['./main/master/zone/zone-master'])
  // }

  // viewOrder(data) {
  //   data.mode = 'view';
  //   sessionStorage.setItem('zoneData', JSON.stringify(data))
  //   this.router.navigate(['./main/master/zone/zone-master'])
  // }
  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
