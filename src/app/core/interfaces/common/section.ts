import { ICommonResponse } from "./common-response";

export interface ISection extends ICommonResponse {
    data: Array<ISectionData>;
}

export interface ISectionData {
    name: string,
    sectionId: number,
    status: string,
    statusEnumId: number
}