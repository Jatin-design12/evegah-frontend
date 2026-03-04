//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { NavItem } from './../../shared/interface/nav-item';
import { Component, Input, OnInit } from '@angular/core';
import { ClientMetro } from 'src/app/core/constants/common-constant';
import { DataShareService } from 'src/app/core/services/data-sharing.service'; 
import { environment } from 'src/environments/environment';

// import { userAccess } from 'src/app/core/constants/common-constant';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  showSubmenu: boolean = false;
  isExpanded: boolean;
  isShowing: boolean = false;
  sidebar = true;
  // remove that json need to come from  apis

  navItems: NavItem[] = [
    {
      displayName: 'Live Map',
      iconName: 'my_location',//'location_on',
      route: 'main',
      isSelected: true
    },
    {
      displayName: 'Alert Dashboard',
      iconName: 'dashboard',
      route: 'main/card',
      isSelected: true
    },
   
    {
      displayName: 'User',
      iconName: 'person',
      route: 'maleficent',
      isSelected: true,
      children: [
        {
         displayName: 'User Details',
         iconName: 'person',
         route: 'main/user',
         isSelected: true,
       },
       {
        displayName: 'User-Transaction',
        iconName: 'transfer_within_a_station',
        route: 'main/user-transaction',
        isSelected: true,
      },
      {
        displayName: 'Withdraw Request',
        iconName: 'filter_list',
        route: 'main/withdraw-request',
        isSelected: true,
      }, 

     ]
    },   
    {
        displayName: 'Ride Details',
        iconName: 'directions_bike',
        route: 'main/user/ride-rating',
        isSelected: true,
      },
    {
      displayName: 'Master',
      iconName: 'inventory',
      route: 'maleficent',
      isSelected: true,
      children: [
        {
          displayName: 'Vehicle Model',
          iconName: 'motorcycle',
          route: 'main/master/vehicle',
          isSelected: true,
        },
        {
          displayName: 'Inward',
          iconName: 'assignment_returned',//'open_with',
          route: 'main/inward',
          isSelected: true,
          children: [ 
            {
              displayName: 'Inward Vehicle ',
              iconName: 'directions_bike',
              route: 'main/inward/vehicle',
              isSelected: true,
            },
            {
              displayName: 'Inward IOT Device',
              iconName: 'lock',
              route: 'main/inward/lock',
              isSelected: true,
            },
          ]
        },
       {
          displayName: 'Produce Vehicle',
          iconName: 'local_play',
          route: 'main/produce',
          isSelected: true
        },

        {
          displayName: 'Geofencing ',
          iconName: 'map',
          route: 'maleficent',
          isSelected: true,
          children: [ 
            {
              displayName: 'City',
              iconName: ' location_city',
              route: 'main/master/city',
              isSelected: true,
            },
            {
              displayName: 'Area',
              iconName:'category', //' my_location',
              route: 'main/master/area',
              isSelected: true,
            },
             {
              displayName: 'Zone',
              iconName: 'location_on',//'location_on',
              route: 'main/master/zone',
              isSelected: true,
            }, 
          ]
        },

         
        {
          displayName: 'Vehicle Allocation',//,/'Allotment & List',
          iconName: 'settings_system_daydream',
          route: 'main/allotment',
          isSelected: true
        },
        {
          displayName: 'Fare Plan',
          iconName: 'attach_money',
          route: 'main/master/fare-plan',
          isSelected: true,
        },

      ]
    },
    {
      displayName: 'Other',
      iconName: 'line_weight',
      route: 'maleficent',
      isSelected: true,
      children: [ 

        {
          displayName: 'Set Minimum  Balance',
          iconName: 'account_balance_wallet',
          route: 'main/SetMWBC',
          isSelected: true
        }, {
          displayName: 'App Version History',
          iconName: 'account_balance_wallet',
          route: 'main/VersionUpdate',
          isSelected: true
        },
       
      ]
    },
   
    //  {
    //     displayName: 'othersss',
    //     iconName: 'my_location',//'location_on',
    //     route: 'main',
    //     isSelected: true
    //   }
    
   ];

  constructor(
    public dataSharingService: DataShareService, 
    ) { }
    
  ngOnInit(): void {

    this.getValueFromHeader();

    let clientName= environment.clientName// ClientMetro//this.commonService.checkClientName()
      if(clientName == ClientMetro){
      let index =  this.navItems.findIndex((e:any)=>  e.displayName == 'IOT Device Testing')
      console.log(index)
      this.navItems.splice(index,1)
      }
  }
  getValueFromHeader() {
    this.dataSharingService.sidebarObservable.subscribe(
      (data) => {
        this.isExpanded = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  burgerClick() {
    this.sidebar = !this.sidebar
    this.dataSharingService.sidebarCollapsed(this.sidebar)
  }

  // checkAccessControl() {
  //   this.navItems.forEach((item, index) => {
  //     // console.log("item = ", item.accessControl);
  //     this.navItems[index].isSelected = this.commonService.checkUserAccessControlForNavBar(item.accessControl);
  //   })
  // }
  // checkUserAccessControlForNavBar(item) {
  //   console.log("item = ", item);
  //   return this.commonService.checkUserAccessControlForNavBar(item);
  // }
}