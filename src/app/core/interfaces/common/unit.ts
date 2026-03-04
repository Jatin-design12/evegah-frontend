import { ICommonResponse } from "../common/common-response";
import { IGetUnitData } from "./unit-data";


export interface IGetUnit extends ICommonResponse {
  data: Array<IGetUnitData>;
}
