import { ICommonResponse } from "./common-response";
import { IGetCountryData } from "./country-data";

export interface IGetCountry extends ICommonResponse  {
  data: Array<IGetCountryData>;
}
