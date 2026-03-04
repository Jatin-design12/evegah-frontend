export interface IBookingListData {
    "rideBookingId": string,
    "id": string,
    "minWalletAmount": string,
    "extraCharges": string,
    "userName": string,
    "vehicleId": string,
    "modelName": string,
    "uId": string,
    "vehicleModelUId": string,
    "lockId": string,
    "lockNumber": string,
    "rideBookingMinutes": string,
    "fromRideTime": string,
    "toRideTime": string,
    "actualRideTime": string,
    "actualRideMin": string,
    "ridePaymentStatus": string,
    "hiringCharges": string,
    "perviousCharges": string,
    "createdOnDate": string,
    "updatedOnDate": string,
    "statusEnumId": string,
    "paymentDetails": {
      "id": string,
      "entity": string,
      "amount": Number,
      "currency": string,
      "status": string,
      "order_id": string,
      "invoice_id": string,
      "international": boolean
      "method": string,
      "amount_refunded": number
      "refund_status":string,
      "captured": boolean,
      "description": string,
      "card_id": string,
      "bank":string,
      "wallet":string,
      "vpa":string,
      "email": string,
      "contact": string,
      "notes": [],
      "fee": number
      "tax": number
      "error_code": string,
      "error_description":string,
      "error_source": string,
      "error_step": string,
      "error_reason": string,
      "acquirer_data": {
        "rrn": string,
        "upi_transaction_id":string,
      },
      "created_at": number
    }
  
}