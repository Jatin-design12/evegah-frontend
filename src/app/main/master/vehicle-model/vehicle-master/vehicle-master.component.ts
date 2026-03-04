import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { VehicleModelService } from '../../../../core/services/vehicle.service';
import { CommonService } from 'src/app/core/services/common.services';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VehicleModal } from 'src/app/core/models/vehicle/vehicle-master';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ImageData } from 'src/app/core/models/common/image-model';
import { noNegativeNumberValidator } from '../../../../core/validations/negativeNumber';
import { minimumTimeValidator } from '../../../../core/validations/minimumTime';
import { minimumRateValidator } from 'src/app/core/validations/minimumRate';
import { ReportService } from 'src/app/core/services/report/report.service';
import {
  Accessories,
  BatteryType,
  BrakeType,
  ForAdminImage,
  ForMobileImage,
  FrameType,
  VehicleType,
  fe_action_add,
  fe_request_from_admin,
} from 'src/app/core/constants/common-constant';
import { FarePlanService } from 'src/app/core/services/master/farePlan/fare-plan.service';
import { catchError } from 'rxjs/operators';
import { error } from 'console';

@Component({
  selector: 'app-vehicle-master',
  templateUrl: './vehicle-master.component.html',
  styleUrls: ['./vehicle-master.component.scss'],
})
export class VehicleMasterComponent implements OnInit {
  formMode;
  heading: string = 'Add Vehicle Model';
  btnLabel = 'Save';
  imageObj = new ImageData();
  vehicleForm: FormGroup;
  vehicletype = new Uiconfig();
  multiDropdown = new Uiconfig();

  vehicleTypeDropdown = new Uiconfig();
  vehicleTypeData = [];

  batteryTypeDropdown = new Uiconfig();
  batteryTypeData = [];

  frameTypeDropdown = new Uiconfig();
  frameTypeData = [];

  brakeTypeDropdown = new Uiconfig();
  brakeTypeData = [];

  AccessoriesDropdown = new Uiconfig();
  accessoriesData = [];

  subscription: Subscription[] = [];
  lengthUnitData;
  editData1;
  VehicleModal = new VehicleModal();
  VehicleTypeArray = [];
  loader: boolean = false;
  editMode: boolean = false;
  viewMode: boolean = false;
  count: number = 0;
  class: string = 'defaultColor';

  imgButtons = new Array<number>(3);
  image1Data;
  image1: any;
  image2: any;
  image3: any;
  image1DataJson: any;
  image2DataJson: any;
  image3DataJson: any;

  imgButtonsAdmin = new Array<number>(3);
  image1AdminData;
  image1Admin: any;
  image2Admin: any;
  image3Admin: any;
  image1DataAdminJson: any;
  image2DataAdminJson: any;
  image3DataAdminJson: any;
  userData: any;

  forMobileImage = ForMobileImage;
  forAdminImage = ForAdminImage;

  selectAllBrake: boolean = false;
  companyName:string=''


  constructor(
    public activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private reportService: ReportService,
    private farePlanService: FarePlanService,
    public formBuilder: FormBuilder,
    public router: Router,
    public Vehicle: VehicleModelService
  ) {}
  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user'));
    this.setFormControls();
    this.getLengthUnit();
    this.setDefaultConfig();
    this.allDropDownCall();

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.title === 'edit' || params.title === 'view') {
        this.formMode = 'edit';
        console.log(JSON.parse(params.data));
        this.editData1 = JSON.parse(params.data);
        this.vehicleForm.patchValue({
          vehicleId: this.editData1.vehicleId,
          vehicleType: this.editData1.vehicleType,
          modelName: this.editData1.modelName.replace(this.editData1.brandName, ''),
          brakeType: this.editData1.breakType.map((e) => Number(e)), //Number(this.editData1.brakesType),
          brandName: this.editData1.brandName,
          companyName: this.editData1.companyName,

          motorType: this.editData1.motorType,
          maxRangeOn100PercentageBatteryKM:this.editData1.maxRangeOn100PercentageBatteryKM,
          frameType: Number(this.editData1.frameType),
          batteryType: this.editData1.batteryType.map((e) => Number(e)), // Number(this.editData1.batteryType),
          accessories: this.editData1.accesarries.map((e) => Number(e)), //Number(this.editData1.accesarries),
          tiersSize: this.editData1.tiersSize,
          minHireTime: this.editData1.minHireTime,
          miniRate: this.editData1.length,
          batteryCapacityAh: this.editData1.batteryCapacityAh,
          batteryCapacityVolt: this.editData1.batteryCapacityVolt,
          length: {
            input: this.editData1.length,
            dropdown: this.editData1.heightUnit,
          },
          width: {
            input: this.editData1.width,
            dropdown: this.editData1.widthUnit,
          },
          weight: {
            input: this.editData1.weight,
            dropdown: this.editData1.weightUnit,
          },
          height: {
            input: this.editData1.height,
            dropdown: this.editData1.heightUnit,
          },
          statusEnumId: 1,
          remark: this.editData1.remarks,
          actionByLoginUserId: Number(this.userData.id),
          actionByUserTypeEnumId: Number(this.userData.user_type_enum_id),
          color: this.editData1.color,
          // vehicleImage: [...JSON.parse(params.data).vehicleImage] ,
          mobileImageArray: [...JSON.parse(params.data).mobileImageArray],
          adminImageArray: [...JSON.parse(params.data).adminImageArray],
        });
        this.companyName =this.editData1.brandName ||''
        if (JSON.parse(params.data).mobileImageArray.length > 0) {
          let imageSeralNo1 = JSON.parse(params.data).mobileImageArray.find(
            (obj) => {
              return Number(obj.imageSerialNumber) === 1;
            }
          );
          let imageSeralNo2 = JSON.parse(params.data).mobileImageArray.find(
            (obj) => {
              return Number(obj.imageSerialNumber) === 2;
            }
          );
          let imageSeralNo3 = JSON.parse(params.data).mobileImageArray.find(
            (obj) => {
              return Number(obj.imageSerialNumber) === 3;
            }
          );
          if (imageSeralNo1) {
            this.image1 = imageSeralNo1.image_unique_signed_url;
            this.image1DataJson = imageSeralNo1;
          }
          if (imageSeralNo2) {
            this.image2 = imageSeralNo2.image_unique_signed_url;
            this.image2DataJson = imageSeralNo2;
          }
          if (imageSeralNo3) {
            this.image3 = imageSeralNo3.image_unique_signed_url;
            this.image3DataJson = imageSeralNo3;
          }
        }
        if (JSON.parse(params.data).adminImageArray.length > 0) {
          let imageSeralNo1 = JSON.parse(params.data).adminImageArray.find(
            (obj) => {
              return Number(obj.imageSerialNumber) === 4;
            }
          );
          let imageSeralNo2 = JSON.parse(params.data).adminImageArray.find(
            (obj) => {
              return Number(obj.imageSerialNumber) === 5;
            }
          );
          let imageSeralNo3 = JSON.parse(params.data).adminImageArray.find(
            (obj) => {
              return Number(obj.imageSerialNumber) === 6;
            }
          );
          if (imageSeralNo1) {
            this.image1Admin = imageSeralNo1.image_unique_signed_url;
            this.image1DataAdminJson = imageSeralNo1;
          }
          if (imageSeralNo2) {
            this.image2Admin = imageSeralNo2.image_unique_signed_url;
            this.image2DataAdminJson = imageSeralNo2;
          }
          if (imageSeralNo3) {
            this.image3Admin = imageSeralNo3.image_unique_signed_url;
            this.image3DataAdminJson = imageSeralNo3;
          }
        }

        this.btnLabel = 'Update';
        let head= this.editData1.modelName.replace(this.editData1.brandName, '')
        this.heading = `Edit ${head} `;
      } else {
        this.formMode = 'new';
        this.vehicleForm.patchValue({ vehicleImage: [] });
        this.vehicleForm.patchValue({ mobileImageArray: [] });
        this.vehicleForm.patchValue({ adminImageArray: [] });
      }

      if (params.title === 'view') {
        this.vehicleForm.disable();
      }
    });
    // this.VehicleTypeArray.push({vehicleTypeId :1 ,vehicleTypeName: "Evegha"});
  }

  setFormControls() {
    this.vehicleForm = this.formBuilder.group({
      vehicleId: 0,
      vehicleType: ['', [Validators.required]],
      modelName: ['', [Validators.required]],
      choseImage: [''],
      choseImageAdmin: [''],
      brakesType: [''],
      brandName: ['', [Validators.required]],
      frameType: ['', [Validators.required]],
      tiersSize: ['0'],
      // minHireTime: ['10' ,[noNegativeNumberValidator,minimumTimeValidator]],
      // minimumRentRate: ['5', [noNegativeNumberValidator,minimumRateValidator]],
      length: [''],
      width: [],
      weight: [],
      height: [],
      statusEnumId: 1,
      remark: [''],
      // actionByLoginUserId: 1,
      // actionByUserTypeEnumId: 3,
      actionByLoginUserId: [Number(this.userData.id)],
      actionByUserTypeEnumId: [Number(this.userData.user_type_enum_id)],
      vehicleImage: [],
      mobileImageArray: [],
      adminImageArray: [],
      // vehicleType:[[Validators.required]],
      // frameType:[],
      brakeType: ['', [Validators.required]],
      accessories: ['', [Validators.required]],
      batteryType: ['', [Validators.required]],
      motorType: [],
      color: [],
      batteryCapacityVolt: ['', [Validators.min(0), Validators.max(100)]],
      batteryCapacityAh: ['', [Validators.min(0), Validators.max(100)]],
      maxRangeOn100PercentageBatteryKM:['', [Validators.min(0), ]], //Validators.max(100) remove by Client
      companyName: [],
    });
  }

  setDefaultConfig() {
    // Vehicle Type
    this.vehicletype.label = 'Vehicle Type';
    this.vehicletype.multiple = true;
    this.multiDropdown.key = 'vehicleTypeId';
    ///multi input  drop
    this.multiDropdown.label = 'Unit';
    this.multiDropdown.displayKey = 'unitName';
    this.multiDropdown.key = 'unitId';

    // Vehicle Type DropDown
    this.vehicleTypeDropdown.label = 'Vehicle Type';
    this.vehicleTypeDropdown.key = 'vehicle_type';
    this.vehicleTypeDropdown.displayKey = 'vehicle_type_name';

    // Battery Type DropDown
    this.batteryTypeDropdown.label = 'Battery Type';
    this.batteryTypeDropdown.key = 'enum_id';
    this.batteryTypeDropdown.displayKey = 'display_name';
    this.batteryTypeDropdown.multiple = true;

    // Frame Type DropDown
    this.frameTypeDropdown.label = 'Frame Type';
    this.frameTypeDropdown.key = 'enum_id';
    this.frameTypeDropdown.displayKey = 'display_name';
    // this.frameTypeDropdown.multiple = true;

    // brake Type DropDown
    this.brakeTypeDropdown.label = 'brake Type';
    this.brakeTypeDropdown.key = 'enum_id';
    this.brakeTypeDropdown.displayKey = 'display_name';
    this.brakeTypeDropdown.multiple = true;

    // Accessories Type DropDown
    this.AccessoriesDropdown.label = 'Accessories';
    this.AccessoriesDropdown.key = 'enum_id';
    this.AccessoriesDropdown.displayKey = 'display_name';
    this.AccessoriesDropdown.multiple = true;
  }

  allDropDownCall() {
    this.getVehicleTypeData();
    this.getBatteryTypeData();
    this.getFrameTypeData();
    this.getBrakeTypeData();
    this.getAccessoriesData();
  }

  getVehicleTypeData() {
    this.vehicleTypeData = [];
    this.subscription.push(
      this.farePlanService.getvehicleTypeList().subscribe((res) => {
        if (res.statusCode === 200) {
          this.vehicleTypeData = res.data;
        } else {
        }
      })
    );
  }

  getBatteryTypeData() {
    this.subscription.push(
      this.reportService.GetEnumDetails(BatteryType).subscribe((res) => {
        if (res.statusCode === 200) {
          // this.spinner.hide();
          this.batteryTypeData = res.data;
        } else {
          // this.spinner.hide();
          // this.toastr.warning(res.message)
        }
      })
    );
  }

  getFrameTypeData() {
    this.subscription.push(
      this.reportService.GetEnumDetails(FrameType).subscribe((res) => {
        if (res.statusCode === 200) {
          // this.spinner.hide();
          this.frameTypeData = res.data;
        } else {
          // this.spinner.hide();
          // this.toastr.warning(res.message)
        }
      })
    );
  }

  getBrakeTypeData() {
    this.subscription.push(
      this.reportService.GetEnumDetails(BrakeType).subscribe((res) => {
        if (res.statusCode === 200) {
          // this.spinner.hide();
          this.brakeTypeData = res.data;
        } else {
          // this.spinner.hide();
          // this.toastr.warning(res.message)
        }
      })
    );
  }

  getAccessoriesData() {
    this.subscription.push(
      this.reportService.GetEnumDetails(Accessories).subscribe((res) => {
        if (res.statusCode === 200) {
          this.accessoriesData = res.data;
        } else {
        }
      })
    );
  }

  backButton() {
    this.router.navigate(['./main/master/vehicle']);
  }

  getLengthUnit() {
    this.subscription.push(
      this.commonService.getUnitList().subscribe((res) => {
        if (res.statusCode === 200) {
          this.lengthUnitData = res.data;
        }
      })
    );
  }

  addUpdateVehicleModelDetails() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }
    this.VehicleModal = { ...this.vehicleForm.value };
    this.VehicleModal.brakesType = this.vehicleForm.value.brakesType;
    this.VehicleModal.frameType = this.vehicleForm.value.frameType;
    this.VehicleModal.maxRangeOn100PercentageBatteryKM = this.vehicleForm.value.maxRangeOn100PercentageBatteryKM
    this.VehicleModal.vehicleType = Number(this.VehicleModal.vehicleType) || 1;
    // this.VehicleModal.height       =   Number(this.vehicleForm.value.height.input)
    // this.VehicleModal.length       =   Number(this.vehicleForm.value.length.input)
    // this.VehicleModal.weight       =   Number(this.vehicleForm.value.weight.input)
    // this.VehicleModal.width        =   Number(this.vehicleForm.value.width.input)
    // this.VehicleModal.lengthUnit   =   Number(this.vehicleForm.value.length.dropdown)
    // this.VehicleModal.widthUnit    =   Number(this.vehicleForm.value.width.dropdown)
    // this.VehicleModal.weightUnit   =   Number(this.vehicleForm.value.weight.dropdown)
    // this.VehicleModal.heightUnit   =   Number(this.vehicleForm.value.height.dropdown);
    (this.VehicleModal.add = fe_action_add),
      (this.VehicleModal.req = fe_request_from_admin),
      (this.VehicleModal.pageName = 'VehicleMasterComponent');
    this.VehicleModal.option = 'Vehicle Model';

    this.VehicleModal.modelName = this.vehicleForm.value.brandName + this.vehicleForm.value.modelName

    if (this.editMode) {
      this.VehicleModal.add = 'edit';
    }
    this.vehicleForm.value.mobileImageArray =
      this.vehicleForm.value.mobileImageArray.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) =>
              obj.image_name === o.image_name &&
              obj.imageSerialNumber === o.imageSerialNumber
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);

    this.vehicleForm.value.adminImageArray =
      this.vehicleForm.value.adminImageArray.reduce((unique, o) => {
        if (
          !unique.some(
            (obj) =>
              obj.image_name === o.image_name &&
              obj.imageSerialNumber === o.imageSerialNumber
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);

    this.VehicleModal.mobileImageArray =
      this.vehicleForm.value.mobileImageArray;
    this.VehicleModal.adminImageArray = this.vehicleForm.value.adminImageArray;

    console.log(this.VehicleModal, 'model');

    if (
      this.VehicleModal.mobileImageArray.length <= 3 &&
      this.VehicleModal.adminImageArray.length <= 3
    ) {
      this.subscription.push(
        this.Vehicle.vehicleModelInsert(this.VehicleModal).subscribe((res) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
            this.vehicleForm.reset();
            this.router.navigate(['./main/master/vehicle']);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
      );
    } else {
      console.log(this.VehicleModal.mobileImageArray.length);
      this.toastr.warning(
        'Image Array is Full Delete One Of Them ,Array length = ' +
          this.VehicleModal.mobileImageArray.length
      );
    }
  }

  fileChange(event, imagePosition, call) {
    if (this.editMode) {
      this.count++;
    }
    const fileArray = [];
    if (event.target.files[0].size < 500000) {
      for (var i = 0; i < event.target.files.length; i++) {
        fileArray.push(event.target.files[i]);
      }
      this.uploadImageToS3(fileArray, imagePosition, call);
    } else {
      this.toastr.warning('Image size cannot be larger than 500kb');
    }
  }

  uploadProgress: any = 0;
  uploadImageToS3(file, imagePosition, call) {
    // this.vehicleForm.controls.choseImage.disable();
    // this.class = 'disableColor'
    this.loader = true;
    if (
      this.vehicleForm.value.mobileImageArray.length > 0 &&
      call == this.forMobileImage
    ) {
      //|| call == this.forMobileImage
      this.vehicleForm.value.mobileImageArray.forEach((element, index) => {
        if (Number(element.imageSerialNumber) === imagePosition) {
          this.vehicleForm.value.mobileImageArray.splice(index, 1);
        }
      });
    }
    if (
      this.vehicleForm.value.adminImageArray.length > 0 &&
      call == this.forAdminImage
    ) {
      //
      this.vehicleForm.value.adminImageArray.forEach((element, index) => {
        if (Number(element.imageSerialNumber) === imagePosition) {
          this.vehicleForm.value.adminImageArray.splice(index, 1);
        }
      });
    }
    this.subscription.push(
      this.commonService.uploadImage(file).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.uploadProgress = 0;
              const progress = Math.round((event.loaded / event.total) * 100);
              this.uploadProgress = progress;
              console.log(progress, 'progress');
              break;
            case HttpEventType.Response:
              const body = event.body;
              if (body.status === 'ERROR') {
                this.toastr.warning(body.message);
              } else {
                console.log(body.data);
                this.imageObj = body.data;
                this.image1Data = {
                  imageId: 0,
                  image_name: this.imageObj[0].file_name,
                  image_unique_name: this.imageObj[0].unique_file_name,
                  image_unique_signed_url: this.imageObj[0].getSingedUrl,
                  statusEnumId: '1',
                  vehicleId: 0,
                  call: call,
                };
                // this.vehicleForm.value.mobileImageArray.push(this.image1Data)
                console.log(
                  call == this.forAdminImage,
                  this.forMobileImage,
                  call,
                  this.forAdminImage
                );
                if (call == this.forAdminImage) {
                  this.vehicleForm.value.adminImageArray.push(this.image1Data);
                  if (imagePosition === 4) {
                    this.image1Data.imageSerialNumber = 4;
                    this.image1Data.imageFor = this.forAdminImage;
                    this.image1Admin = this.imageObj[0].getSingedUrl;
                    this.image1DataAdminJson = this.image1Data;
                    console.log(this.image1DataAdminJson, 'check');
                  } else if (imagePosition === 5) {
                    this.image1Data.imageSerialNumber = 5;
                    this.image1Data.imageFor = this.forAdminImage;
                    this.image2Admin = this.imageObj[0].getSingedUrl;
                    this.image2DataAdminJson = this.image1Data;
                  } else if (imagePosition === 6) {
                    this.image1Data.imageSerialNumber = 6;
                    this.image1Data.imageFor = this.forAdminImage;
                    this.image3Admin = this.imageObj[0].getSingedUrl;
                    this.image3DataAdminJson = this.image1Data;
                  }
                } else if (call == this.forMobileImage) {
                  this.vehicleForm.value.mobileImageArray.push(this.image1Data);
                  if (imagePosition === 1) {
                    this.image1Data.imageSerialNumber = 1;
                    this.image1Data.imageFor = this.forMobileImage;
                    this.image1 = this.imageObj[0].getSingedUrl;
                    this.image1DataJson = this.image1Data;
                  } else if (imagePosition === 2) {
                    this.image1Data.imageSerialNumber = 2;
                    this.image1Data.imageFor = this.forMobileImage;
                    this.image2 = this.imageObj[0].getSingedUrl;
                    this.image2DataJson = this.image1Data;
                  } else if (imagePosition === 3) {
                    this.image1Data.imageSerialNumber = 3;
                    this.image1Data.imageFor = this.forMobileImage;
                    this.image3 = this.imageObj[0].getSingedUrl;
                    this.image3DataJson = this.image1Data;
                  }
                }

                this.loader = false;
                this.toastr.success('Attachment is uploaded');
               
              }
          }
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  removeImage(item, index, call) {

    if (this.editMode) {
      this.count++;
    }
    if (this.count === 1) {
      this.imageObj = new ImageData();
    } else {
      this.deleteImage(item, index, call);
      this.class = 'defaultColor';
      this.imageObj = new ImageData();
    }
  }

  async deleteImage(imageData, i, call) {
    console.log(imageData, i);
    const fileName = {
      file_name: imageData.image_unique_name,
    };
    if (call == this.forMobileImage) {
      const index = this.vehicleForm.value.mobileImageArray.findIndex(
        (obj) =>
        (Number(obj.id) === Number(imageData.id) &&
        Number(obj.imageSerialNumber) === Number(imageData.imageSerialNumber)) || (Number(obj.imageId) === Number(imageData.imageId))
      );
      if (index > -1) {
        this.vehicleForm.value.mobileImageArray.splice(index, 1);
        if (i == 1) this.image1 = false;
        if (i == 2) this.image2 = false;
        if (i == 3) this.image3 = false;
      }

    } 
    else if (call == this.forAdminImage) {
      const index = this.vehicleForm.value.adminImageArray.findIndex(
        (obj) =>
        
          (Number(obj.id) === Number(imageData.id) &&
          Number(obj.imageSerialNumber) === Number(imageData.imageSerialNumber)) || (Number(obj.imageId) === Number(imageData.imageId))
        
          
      );
      if (index > -1) {
        console.log("indes find")
        this.vehicleForm.value.adminImageArray.splice(index, 1);
        if (i == 4) this.image1Admin = false;
        if (i == 5) this.image2Admin = false;
        if (i == 6) this.image3Admin = false;
      }
    }

    // this.subscription.push( this.commonService.deleteImage(fileName).subscribe((res) => {
    //             if (res.statusCode === 200) {
    //               this.toastr.success(res.message);
  
    //             } else {
    //               this.toastr.warning(res.message)
    //             }
    //        }) )

    //  console.log(this.vehicleForm.value,"this.vehicleForm.value")
    //     this.VehicleModal              = {...this.vehicleForm.value} ;
    //     this.VehicleModal.brakesType   =  this.vehicleForm.value.brakesType;
    //     this.VehicleModal.frameType    =  this.vehicleForm.value.frameType
    //     this.VehicleModal.vehicleType  =   Number(this.VehicleModal.vehicleType)||1
    // this.VehicleModal.height       =   Number(this.vehicleForm.value.height.input)
    // this.VehicleModal.length       =   Number(this.vehicleForm.value.length.input)
    // this.VehicleModal.weight       =   Number(this.vehicleForm.value.weight.input)
    // this.VehicleModal.width        =   Number(this.vehicleForm.value.width.input)
    // this.VehicleModal.lengthUnit   =   Number(this.vehicleForm.value.length.dropdown)
    // this.VehicleModal.widthUnit    =   Number(this.vehicleForm.value.width.dropdown)
    // this.VehicleModal.weightUnit   =   Number(this.vehicleForm.value.weight.dropdown)
    // this.VehicleModal.heightUnit   =   Number(this.vehicleForm.value.height.dropdown);

    //   this.VehicleModal.mobileImageArray = this.vehicleForm.value.mobileImageArray;
    //   console.log("form submit ",this.VehicleModal)
    //   this.VehicleModal.add = fe_action_add,
    // this.VehicleModal.req= fe_request_from_admin,
    // this.VehicleModal.pageName="VehicleMasterComponent"
    // this.VehicleModal.option='Vehicle Model'

    // if(this.editMode){
    //   this.VehicleModal.add = "edit"
    // }

    // this.subscription.push(this.Vehicle.vehicleModelInsert(this.VehicleModal).subscribe((res) => {
    //   if (res.statusCode === 200) {
    //     this.toastr.success(res.message);
    //      this.getVehicleModelDetails(this.VehicleModal.vehicleId,imaggeData)
    //     //  this.subscription.push( this.commonService.deleteImage(fileName).subscribe((res) => {
    //     //       if (res.statusCode === 200) {
    //     //         this.toastr.success(res.message);

    //     //       } else {
    //     //         this.toastr.warning(res.message)
    //     //       }
    //     //  }))

    //   } else if (res.statusCode === 422) {
    //     this.toastr.warning(res.message)
    //   }else {
    //     this.toastr.warning(res.message);
    //   }
    // }))
  }
  clear() {
    this.imageObj = new ImageData();
    this.vehicleForm.reset();
    this.vehicleForm.controls.statusEnumId.setValue(1);
    this.class = 'defaultColor';
    this.vehicleForm.controls.choseImage.enable();
    this.imageObj.file_name = 'No File Chosen';
  }

  getVehicleModelDetails(id, deletedImage) {
    this.subscription.push(
      this.Vehicle.getVehicleModelDetails(id, 1).subscribe((res) => {
        if (res.statusCode === 200) {
          this.vehicleForm.value.mobileImageArray = res.data[0].vehicleImage;
          console.log(
            'new image array',
            this.vehicleForm.value.mobileImageArray
          );
          // let imageSeralNo1 =  res.data[0].vehicleImage.find((obj) => {
          //   return  Number(obj.imageSerialNumber) === 1;
          // });
          // let imageSeralNo2 =  res.data[0].vehicleImage.find((obj) => {
          //  return Number(obj.imageSerialNumber) === 2;
          // });
          // let imageSeralNo3 =  res.data[0].vehicleImage.find((obj) => {
          //  return Number(obj.imageSerialNumber) === 3;
          // });

          // if(imageSeralNo1){
          //   this.image1  = imageSeralNo1?.image_unique_signed_url;
          //   this.image1DataJson = imageSeralNo1
          // }else{
          //   this.image1  = '';
          //   this.image1DataJson = ''
          // }

          // if(imageSeralNo2){
          //   this.image2  = imageSeralNo2?.image_unique_signed_url;
          //   this.image2DataJson = imageSeralNo2
          // }else{
          //   this.image2  = '';
          //   this.image2DataJson = ''
          // }

          // if(imageSeralNo3){
          //   this.image3  = imageSeralNo3?.image_unique_signed_url;
          //   this.image3DataJson = imageSeralNo3;
          // }else{
          //   this.image3  = '';
          //   this.image3DataJson = ''
          // }
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  checkBrake(e) {
    console.log(e);
    if (e.length === this.brakeTypeData.length) {
      this.selectAllBrake = true;
      this.vehicleForm.controls.brakeType.setValue('');
      if (e.length > 2) {
        this.toastr.warning('Please Select Only two Value');
        this.vehicleForm.controls.brakeType.setValue('');
        this.selectAllBrake = false;
      } else {
        this.selectAllBrake = false;
      }
    } else {
      this.selectAllBrake = false;
    }
  }

  accessoriesCheck: boolean = false;
  batteryCheck: boolean = false;
  selectAllAccessories(e, data) {
    if (e.length === data.length) this.accessoriesCheck = true;
    else this.accessoriesCheck = false;
  }

  selectAllBattery(e, data) {
    if (e.length === data.length) this.batteryCheck = true;
    else this.batteryCheck = false;
  }

  InputCompanyName(event){
    // this.vehicleForm.controls.modelName.setValue(event.target.value)
    this.companyName =event.target.value
  }

  checkCompanyName(e){
   console.log(e.target.value)
  }
}
