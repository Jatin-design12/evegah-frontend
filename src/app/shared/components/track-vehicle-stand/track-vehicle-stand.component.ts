import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-track-vehicle-stand',
  templateUrl: './track-vehicle-stand.component.html',
  styleUrls: ['./track-vehicle-stand.component.scss']
})
export class TrackVehicleStandComponent implements OnInit {
  cols:any=[]
  tableData:[]=[]
  constructor(
   
    public dialogRef: MatDialogRef<TrackVehicleStandComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, 
     private dashboardService:DashboardService) { }
  ngOnInit(): void {
    console.log(this.data,"data")
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      

      {
        key: 'bikeName',
        display: 'Vehicle ID',
        sort: true,
        //config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
      },

      // {
      //   key: 'lockStatus',
      //   display: 'Lock Status',
      //   sort: true,
      // },
      // {
      //   key: 'instructionName',
      //   display: 'Device Instruction ',
      //   sort: true,
      // },
      // {
      //   key: 'deviceLightStatus',
      //   display: 'light Status',
      //   sort: true,
      // },

      // {
      //   key: 'deviceLightInstruction',
      //   display: 'Light Instruction',
      //   sort: true,
      // },

      // {
      //   key: 'latitude',
      //   display: 'Latitude',
      //   sort: true,
      // },
      // {
      //   key: 'longitude',
      //   display: 'Longitude',
      //   sort: true,
      // },
      
      {
        key: 'batteryPercentage',
        display: 'Battery %',
        sort: true,
      },
      // {
      //   key: 'lockIMEINumber',
      //   display: 'Lock IMEI No.',
      //   sort: true,
      // },
      // {
      //   key: 'devicestatus',
      //   display: 'Device Status',
      //   sort: true,
      // },
    
    ];

    this.getData(this.data.data.zoneName.zoneId)
  }

  getData(id){

    this.tableData=[]

      this.dashboardService.getBikeByZoneIdForMap(id).subscribe((res) => {
        if (res.statusCode === 200) {
         
          let data:any = res.data;
          
          if(data.avaialableBikeListData || data.underMantanceBikeListData || data.activeBikeListData){
            let allData:any = [
              ...data.avaialableBikeListData,
              ...data.underMantanceBikeListData,
               ...data.activeBikeListData
            ]
        
            console.log(allData)
            this.tableData = allData
          }
          console.log(res.data, 'available');
          // this.spinner.hide()
          //this.BikeProduceDetailsList.push( res.data.find(e => e.allotmentStatusName === 'Allocated'))
        }
      });
    
    if(this.data.data.avaialableBikeListData || this.data.data.underMantanceBikeListData || this.data.data.activeBikeListData){
      let allData:any = [
        ...this.data.data.avaialableBikeListData,
        ...this.data.data.underMantanceBikeListData,
         ...this.data.data.activeBikeListData
      ]
  
      console.log(allData)
      this.tableData = allData
    }
   



console.log(this.tableData)
  }

  closemodel(){
    this.dialogRef.close(false)

  }

  showBike(){
    this.dialogRef.close(true)
  
  }
}
