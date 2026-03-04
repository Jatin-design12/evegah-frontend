import { IRideRating } from "../../interfaces/user/ride-rating";

export class ModelRideRating implements IRideRating{
    rideCommentsReply:any
    rideBookingId:Number
    add:string
    req:number;
    pageName :string;
    option :string;
}