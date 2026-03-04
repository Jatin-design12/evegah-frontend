
import { CommonResponse } from "../../models/common/common-response-model";
import { IGetCityData } from "./city-data";


export interface IGetCity extends CommonResponse  {
  data: Array<IGetCityData>;
}
