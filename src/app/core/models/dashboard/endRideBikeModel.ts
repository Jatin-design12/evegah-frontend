import { IEndBikeRideData } from "../../interfaces/dashboard/end-bike-ride-data";

export class EndRideBikeModel  implements IEndBikeRideData {
    "bikeId":number;
    "rideBookingId":Number;
    "id":Number;
    "extraCharges":Number;
    "actualRideTime":String;
    "rideEndLatitude":String;
    "rideEndLongitude":String;
    "remarks":String
    "endRideUserId":Number
}