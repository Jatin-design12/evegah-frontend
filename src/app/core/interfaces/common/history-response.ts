import { CommonResponse } from "../../models/common/common-response-model";
import { IGetHistory } from "./history-get-response";

export interface IHistoryData extends CommonResponse {
  data: Array<IGetHistory>
}
