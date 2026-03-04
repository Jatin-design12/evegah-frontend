import { IlockModelDetailss } from "../../interfaces/lockInward/lockInward";

export  class LockInward implements IlockModelDetailss{
    lockInwardId: number;
    lockNumber: string;
    lockIMEINumber: number;
    inwardDate: string;
    statusEnumId: number;
    remark: string;
    actionByLoginUserId: number;
    actionByUserTypeEnumId: number;

}