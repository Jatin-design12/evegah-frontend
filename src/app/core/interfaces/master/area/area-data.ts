export interface IAreaData {
    "areaId":Number,
  "name":String ,
  "stateId":Number ,
  "cityId":Number,
  "areaTypeEnumId":Number,
  "statusEnumId":Number ,
  "createdById":Number,
  "mapCountryName":String ,
  "mapStateName":String,
  "mapCityName":String,
  
   "placeId": String  ,
   "PinCode":number,
   "fullAddress":String,
   "mapDrawObjectEnumId":number,
   "mapDrawObject":Array<any>,
   "mapDrawObjectAddress":Array<any>

   mapCityId:Number;
    "center":Array<number>//[22.721231275904092, 75.85573023649293],
    "radius":Number//268.47648648346586,
     "sw":Array<number>//[22.665891269711715,75.88826734671392],
     "ne":Array<number>//[22.699151984636835,75.9425123418311],
     "polygonpoint":Array<any>//[[22.72036,75.847748], [22.721231, 75.849508], [22.721865, 75.851396], [22.721152, 75.852383], [22.720479, 75.853456], [22.719292 ,75.85204], [22.720558 ,75.85161],[22.719806 ,75.850065],[22.7204, 75.84895]],
      "polygonpoint2":any//"POLYGON((22.72036 75.847748,22.721231 75.849508,22.721865 75.851396,22.721152 75.852383,22.720479 75.853456,22.719292 75.85204,22.720558 75.85161,22.719806 75.850065,22.7204 75.84895,22.72036 75.847748))"

}
