import { IBikeUndermaintenanceData } from "../../interfaces/dashboard/bike-undermaintenance-data";

export class maintanceBikeModel  implements IBikeUndermaintenanceData {
    bikeId: Number;
    userId: Number;
    remarks: String;
    deviceId:Number;
}
