import { IFarePlanData } from "../../interfaces/master/fareplan/fare-plan-data";

export class FarePlanModel implements IFarePlanData
{
    
        data:[{
            farePlanId:Number,
            cityId:Number ,
            areaTypeEnumId:Number,
            areaId:Number ,
            modelId:Number ,
            aplicableDate:Number ,
            hireTimeInMinuts:Number,
            perMinuteRateMonday:Number ,
            perMinuteRateTuesday:Number ,
            perMinuteRateWednesday:Number ,
            perMinuteRateThursday:Number ,
            perMinuteRateFriday:Number ,
            perMinuteRateSaturday:Number ,
            perMinuteRateSunday:Number ,
            statusEnumId:Number ,
            createdonDate:Number ,
            createdyId:Number
         } ]
        }
        
        