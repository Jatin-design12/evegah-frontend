import { ICommonResponse } from "../common/common-response";
import { IGetStateData } from "./state-data";

export interface IGetState extends ICommonResponse {
  data: Array<IGetStateData>;
}
