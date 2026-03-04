import {IVehicleModelDetails } from "src/app/core/interfaces/vehicle/addvehicle";

export class VehicleModal implements IVehicleModelDetails {
    vehicleId: number;
    vehicleType: number;
    modelName: string;
    brakesType: number;
    brandName: string;
    frameType: number;
    tiersSize: number;
    minHireTime: string;
    length: number;
    lengthUnit: number;
    width: number;
    widthUnit: number;
    weight: number;
    weightUnit: number;
    height: number;
    heightUnit: number;
    statusEnumId: number;
    remark: string;
    actionByLoginUserId: number;
    actionByUserTypeEnumId: number;
  MiniRate: any;
  // vehicleImage:any
  mobileImageArray:any
  adminImageArray:any

  "breakType": Array<any>
  "batteryType": Array<any>
  // "frameType": 70,
  "batteryCapacityAh": 10
  "batteryCapacityVolt": 90
  "accesarries": Array<any>
  "motorType":string
  "color": string
  companyName:string
  
  option:string
  add:string
  req:Number
  pageName:string
  maxRangeOn100PercentageBatteryKM:Number

}