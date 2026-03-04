import { IaddUpdateZone } from "../../interfaces/zone/addZone";

export class addUpdateZone implements IaddUpdateZone {
        id: number;
        stateName: string;
        cityName: string;
        statusName: string;
        remarks: string;
        actionRemarks: string;
        createdOnDate: string;
        createdByLoginUserId: number;
        createdByUserName: string;
        createdByUserTypeEnumId: number;
        createdByUserTypeName: string;
        updatedLoginUserId: number;
        updatedLoginUserName: string;
        updatedOnDate: string;
        updatedByUserTypeEnumId: number;
        updatedByUserTypeName: string;  
   
        zoneId: Number;
        name: string;
        latitude: string;
        longitude: string;
        zoneSize: number;
        zoneCapacity: number;
        zoneAddress:string;
        cityId: number;
        stateId: number;
        statusEnumId: number;
        remark:string;
        actionByLoginUserId:Number;
        actionByUserTypeEnumId: Number;
        areaId:number;
     }