import { CommonResponse } from "../../models/common/common-response-model";
import { IBookingListData } from "./list-data";

export interface IGetBookingData extends CommonResponse{
    data: Array<IBookingListData>
}