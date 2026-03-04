import { CommonResponse } from "../../models/common/common-response-model";
import { ILockListData } from "./list-data";

export  interface IGetLockInward extends CommonResponse {
    data: Array<ILockListData>
}