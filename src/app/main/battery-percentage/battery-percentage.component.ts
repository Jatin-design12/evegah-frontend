import { Component, OnInit } from '@angular/core';
import { Router ,NavigationExtras} from '@angular/router';
import { Subscription } from 'rxjs';
import { BatteryService } from 'src/app/core/services/bikeBattery/battery.service';
import { EDIT, LOCATEBUTTON, VIEW } from '../../core/constants/common-constant';
@Component({
  selector: 'app-battery-percentage',
  templateUrl: './battery-percentage.component.html',
  styleUrls: ['./battery-percentage.component.scss']
})
export class BatteryPercentageComponent implements OnInit {
  cols = [];
  cols1 = [];
  cols2 = [];
  subscription: Subscription[] = [];
  bikeBatteryStatusLessThenTwenty = []
  produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty = [];
  produceBikeBatteryStatusGraterThenFifty = []; 
  constructor(public batteryService:BatteryService,private router :Router) { }

  ngOnInit(): void {
    this.batteryPercentageData();
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'bikeProduceId',
        display: 'Bike id',
        sort: true,
       // config: { isDate: true, format: 'dd-MM-yyyy' }
      },
      {
        key: 'battery',
        display: 'Battery Percentage',
        sort: true,
      },
      {
        key: 'externalBattV',
        display: 'Voltage',
        sort: true,
      },
      { 
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
      },
      {
        key: 'zoneName',
        display: 'Zone',
        sort: true,
      },
      {
        key: 'bikeBookedStatusName',
        display: 'Ride Status',
        sort: true,
      },
      {
       
        key: 'bikeBatteryStatusLessThenTwenty',
        display: 'Locate',
        sort: false,
        config: { 
          isbutton: true, actions: [LOCATEBUTTON]  },
      },
    ]; 
  
    this.cols1 =[
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'bikeProduceId',
        display: 'Bike id',
        sort: true,
       // config: { isDate: true, format: 'dd-MM-yyyy' }
      },
      {
        key: 'battery',
        display: 'Battery Percentage',
        sort: true,
      },
      {
        key: 'externalBattV',
        display: 'Voltage',
        sort: true,
      },
      { 
        key: 'lockNumber',
        display: 'Device Id',
        sort: true,
      },
      {
        key: 'zoneName',
        display: 'Zone',
        sort: true,
      },
      {
        key: 'bikeBookedStatusName',
        display: 'Ride Status',
        sort: true,
      },
      {
        key: 'bikeBatteryStatusLessThenTwenty',
        display: 'Locate',
        sort: false,
        config: { 
          isbutton: true, actions: [LOCATEBUTTON]  },

      },
    ]; 

    
    this.cols2 =  [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'bikeProduceId',
        display: 'Bike id',
        sort: true,
       // config: { isDate: true, format: 'dd-MM-yyyy' }
      },
      {
        key: 'battery',
        display: 'Battery Percentage',
        sort: true,
      },
      {
        key: 'externalBattV',
        display: 'Voltage',
        sort: true,
      },
      { 
        key: 'lockNumber',
        display: 'Device Id',
        sort: true,
      },
      {
        key: 'zoneName',
        display: 'Zone',
        sort: true,
      },
      {
        key: 'bikeBookedStatusName',
        display: 'Ride Status',
        sort: true,
      },
      {
        key: 'bikeBatteryStatusLessThenTwenty',
        display: 'Locate',
        sort: false,
        config: { 
          isbutton: true, actions: [LOCATEBUTTON]  },

      },
    ]; 
   
  }


  batteryPercentageData(){
    
    this.subscription.push(this.batteryService.BatteryPercentageApi().subscribe((res) => {
      if (res.statusCode === 200) {
         console.log(res)
        
         res.data[0].bikeBatteryStatusLessThenTwenty.forEach(element => {
          if( Number(element.bikeBookedStatus) === 14  ){
                element.locationData = false
          }else{
            element.locationData = true
          }
        });
          
        res.data[0].produceBikeBatteryStatusGraterThenFifty.forEach(element => {
          if(Number(element.bikeBookedStatus) === 14  ){
            element.locationData = false
          }else{
            element.locationData = true
          }
        });
          
        res.data[0].produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty.forEach(element => {
          if(Number(element.bikeBookedStatus) === 14 ){
            element.locationData =  false
          }else{
            element.locationData =  true
          }
        });

         this.bikeBatteryStatusLessThenTwenty = res.data[0].bikeBatteryStatusLessThenTwenty;
         this.produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty =res.data[0].produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty
         this.produceBikeBatteryStatusGraterThenFifty = res.data[0].produceBikeBatteryStatusGraterThenFifty
       
      } 
    }))
 
  }

  onActionHandler(event){
    console.log(event)
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(event)
      },  
    };
    this.router.navigate(['./main'], navigationExtras  );
   
  }
}
