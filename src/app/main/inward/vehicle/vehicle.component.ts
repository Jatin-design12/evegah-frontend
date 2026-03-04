import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActiveOrDeactiveButton, DATE_FORMAT, DATE_TIME_FORMAT, EDIT, toggle } from 'src/app/core/constants/common-constant';
import { ILockListData } from 'src/app/core/interfaces/lockInward/list-data';
import { LockInward } from 'src/app/core/models/inward/lock-inward-model';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { BikeModelService } from 'src/app/core/services/BikeInward/bikeInward.service';
import { VehicleModelService } from 'src/app/core/services/vehicle.service';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { LockService } from 'src/app/core/services/lockInward/lockInward.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit, OnDestroy {
  heading: string = 'Inward Vehicle';
  counter: any;
  bikeinwardForm: FormGroup;
  lockInwardForm: FormGroup;
  modal = new Uiconfig();
  tableData: any = [];
  lockInwardupdateButton: boolean = false;
  lockInwardAddButton: boolean = true;
  editedId: any;
  viewMode: boolean = false;
  lockInwardData = [];
  bankDetailsEditIndex: number;
  subscription: Subscription[] = [];
  cols = [];
  vehicleModel = [];
  BikeModelDetails = [];
  today:any = new Date()
  user = JSON.parse(sessionStorage.getItem('user'));
  Buttonlabel ="Add"

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private BikeService: BikeModelService,
    private LockService: LockService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private VehicleModel: VehicleModelService,
    private spinner: NgxSpinnerService,
    private datePipe:DatePipe
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
        key: 'inwardDate',
        display: 'Date',
        sort: true,
        config: { isDate: true, format: DATE_FORMAT },
      },
      {
        key: 'modelName',
        display: 'Vehicle Model',
        sort: true,
      },
      {
        key: 'vehicleModelUId',
        display: 'Vehicle UID',
        sort: true,
      },
      {
        key: 'bikeStatusName',
        display: 'Allotted Status',
        sort: true,
      }, 
      {
        key:'statusName',
        display:'Status',
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
        display: '',
        sort: false,
        config: { isAction: true, actions: [EDIT] },
      },
      // {
      //   key: 'toggleStatus',
      //   display: 'Action',
      //   sort: false,
      //   config: { trueFalseAction: true , actions: [toggle]},
      // },
      {
        key: 'bikeProduceIdss',
        display: 'Action',
        sort: false,
        config: {
          actions: [
            ActiveOrDeactiveButton
          ],
          isbutton: true,
          isClickAble: true,
        },
      },
      
    ];

    this.getBikeInward();
    this.getVehicleList();
    this.setFormControls();
    this.setDefaultConfig();
    // this.getLockInward();
  }

  setFormControls() {
    this.bikeinwardForm = this.formBuilder.group({
      bikeInwardId: 0,
      inwardDate: [''],
      vehicleId: 3,
      vehicleModelUId: [''],
      statusEnumId: 1,
      remark: 'not yet ',
      actionByLoginUserId:this.user.id,//[''],
      actionByUserTypeEnumId:this.user.user_type_enum_id, //[''],
    });
  }

  setDefaultConfig() {
    // modal
    this.modal.label = 'Select Vehicle Model';
    this.modal.displayKey = 'modelName';
    this.modal.key = 'vehicleId';
    this.modal.multiple = false;
  }

  addBikeInward() {
    console.log(this.bikeinwardForm.value,)
    this.bikeinwardForm.controls.vehicleId.enable()
    const obj= {
      "bikeInwardId":this.bikeinwardForm.value.bikeInwardId || 0,
    "inwardDate":this.bikeinwardForm.value.inwardDate,
    "vehicleId":this.bikeinwardForm.value.vehicleId,
    "vehicleModelUId":this.bikeinwardForm.value.vehicleModelUId,
    "statusEnumId":1,
    "remark":"not now",
    "actionByLoginUserId":this.user.id,
    "actionByUserTypeEnumId":this.user.user_type_enum_id
  }
  console.log(obj)

    this.subscription.push(
      this.BikeService.bikeModelDetails(obj).subscribe(
        (res) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
            this.Buttonlabel="Add"
            this.bikeinwardForm.reset();
            this.getBikeInward();
          } else {
            this.toastr.warning(res.message);
          }
        }
      )
    );
  }

  getBikeInward() {
    this.subscription.push(
      this.BikeService.getBikeModelDetails(0, 0, 0).subscribe((res) => {
        if (res.statusCode === 200) {
          this.BikeModelDetails = res.data;
          res.data.forEach((ele , index)=> {
            // ele.locationData = true;
            ele.isActiveOrDeactive =true

            if(ele.statusEnumId === '1'){
              this.BikeModelDetails[index].toggleStatus = true;
            }else{
              this.BikeModelDetails[index].toggleStatus = false;
            }           
          });
        }
      })
    );
  }


  getVehicleList() {
    this.subscription.push(
      this.VehicleModel.getVehicleList().subscribe((res) => {
        if (res.statusCode === 200) {
          this.vehicleModel = res.data;
          if (res.message === 'Data is not available.') {
            this.vehicleModel.push({ modelName: 'Data is not available.' });
          }
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  onActionHandlerBIKE(event) {
    console.log(event)
    if (event.action === 'edit') {
      if(event.data.bikeInwardId && event.data.bikeStatusEnumId == '6'){
     this.Buttonlabel= 'Update'
      this.bikeinwardForm.controls['bikeInwardId'].setValue(
        Number(event.data.bikeInwardId)
      );
      this.bikeinwardForm.controls['vehicleId'].setValue(event.data.vehicleId);
      this.bikeinwardForm.controls['inwardDate'].setValue(
        event.data.inwardDate
      );
      this.bikeinwardForm.controls['vehicleModelUId'].setValue(
        event.data.vehicleModelUId
      );
      this.bikeinwardForm.controls.vehicleId.disable()
      }
      else{
        this.toastr.warning("Vehicle Inward can not edit")
      }
     
    }
    else if(event.action === 'toggle'){
      this.onActionHandler(event)
    }
    else if(event.action ===ActiveOrDeactiveButton ){
      this.onActionHandler(event)
    }
  }


  onActionHandler(event){
    if(event.data.bikeInwardId && event.data.bikeStatusEnumId == '5'){
      if(Number( event.data.statusEnumId) == 1 ){
        const bikeAllotment = {
          "statusEnumId":2,
          "bikeInwardId":  Number(event.data.bikeInwardId)
        }
        this.activeInactiveBikeInward(bikeAllotment)
      }else{
        const bikeAllotment = {
          "statusEnumId":1,
          "bikeInwardId": Number( event.data.bikeInwardId)
        }
        this.activeInactiveBikeInward(bikeAllotment)
      }
      
    }
    
    
  }

  activeInactiveBikeInward(data){
    this.spinner.show()
    this.subscription.push(this.BikeService.activeInactiveBikeInward(data).subscribe((res) => {
      if (res.statusCode === 200) {
      
        this.getBikeInward();
        this.spinner.hide()
      } 
      this.spinner.hide()
    }))
  }

  backButton() {
    this.router.navigate(['./main']);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }
}
