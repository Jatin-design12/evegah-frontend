// TABLE ACTIONS
export const EDIT = 'edit';
export const DELETE = 'delete';
export const VIEW = 'visibility';
export const DONE = 'done_all';
export const toggle = 'toggle';
export const LOCATEBUTTON = 'locate';
export const LOCKBUTTON = 'lock';
export const MAINTENANCE = 'maintenance';
export const AVAILABLE = 'Ready for Ride';
export const ADD_WALLET = 'Recharge Wallet';
export const ADD_SECURITY_DEPOSIT = 'Add Security Deposit';
export const ADDCREDIT = 'Credit';
export const TRANSACTION = 'Transaction';
export const SECRET_KEY = '123';

export const LIGHTBUTTON = 'Light';
export const BEEPBUTTON = 'Beep';
export const HISTORY = 'History';
export const CLEAR_LOCK_INSTRUCTIONS = 'Clear Lock Instr.';
export const CLEAR_LIGHT_INSTRUCTIONS = 'Clear Light Instr.';
export const POWER_ON_OFF = 'POWER_ON_OFF';

export const onLIGHTBUTTON = 'Light on';
export const offLIGHTBUTTON = 'Light off';

export const UNLOCKBUTTON = 'unlock';
export const ENDBUTTON = 'End Ride';
export const ADDAMOUNT = 'Add';
export const WITHDRAW = 'Withdraw';
export const CANCELWITHDRAW = 'Cancel Request';
export const QR = 'QrCode';
export const ADDRESS_FIELD_LIMIT = 150;

export const DeviceLightInstruction = 'Device Light Status'; //'Device Light Instruction';

export const DeviceBeepStatus = 'Device_Beep_Status';

export const DATE_TIME_FORMAT = 'dd-MM-yyyy h:mm a'
export const DATE_FORMAT = 'dd-MM-yyyy'

// 60	"Device_Beep_Instruction"	"Completed Beep Off Request"
// 59	"Device_Beep_Instruction"	"Completed Beep On Request"
// 58	"Device_Beep_Instruction"	"NoInstruction"
// 57	"Device_Beep_Instruction"	"BeepOff"
// 56	"Device_Beep_Instruction"	"BeepOn"
// 55	"Device_Beep_Status"	"BeepOff"
// 54	"Device_Beep_Status"	"BeepOn"

// TABLE ACTIONS

//master Name  to get  data
export const MASTER = {
  CERTIFICATE: 'Certificate',
  COLOUR: 'Colour',
  METALGEM: 'Metal&gem',
  PURITY: 'Purity',
  CATEGORY: 'Category',
  PATTERN: 'Pattern',
  TYPE: 'Type',
  SHAPE: 'Shape',
  BRAND: 'Brand',
  ADDITIONAL_CHARGE: 'AdditionalCharges',
  SECTION: 'Section',
  BANNER: 'Banner',
  DESIGNATION: 'Designation',
  TAXINFO: 'TaxInfo',
  DOCUMENTS: 'Documents',
  SIZE: 'Size',
  METAL_RATE: 'MetalRate',
};

export const userAccess = {
  DASHBOARD: 'Dashboard',
  INVENTORYNAME: 'Inventory',
  INVENTORY: {
    CATEGORY: 'Category',
    TYPE: 'Type',
    PATTERN: 'Pattern',
    PRODUCT: 'Product',
  },
  MASTERNAME: 'Master',
  MASTER: {
    CERTIFICATE: 'Certificate',
    COLOUR: 'Colour',
    METALGEM: 'Metal&Gems',
    PURITY: 'Purity',
    CATEGORY: 'Category',
    PATTERN: 'Pattern',
    TYPE: 'Type',
    SHAPE: 'Shape',
    BRAND: 'Brand',
    ADDITIONAL_CHARGE: 'AdditionalCharges',
    SECTION: 'Sections',
    BANNER: 'Banner',
    DESIGNATION: 'Designation',
    TAXINFO: 'TaxInfo',
    DOCUMENTS: 'Documents',
    METAL_RATE: 'MetalRate',
    SIZE: 'Size',
  },
  MARKETINGNAME: 'Marketing',
  MARKETING: {
    BANNER: 'Banner',
    NOTIFICATION: 'Notification',
  },
  USERNAME: 'User',
  USER: {
    B2BCUSTOMER: 'B2BCustomer',
    SELLER: 'Seller',
    EMPLOYEE: 'Employee',
    USERACCESS: 'UserAccess',
  },
  ORDER: 'OrderManagement',
  ACTIONS: {
    ADD: 'add',
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete',
  },
};
export const DESCRIPTION_FIELD_LIMIT = 500;
export const SHORT_DESCRIPTION_FIELD_LIMIT = 100;
export const NAME_FIELD_MAX_LIMIT = 15;
export const NAME_FIELD_MIN_LIMIT = 4;
export const ALPHABETS_PATTERN = /^[a-zA-Z\s ]*$/;

// history table coulmnName
export const HISTORY_TABLE_COLUMN = [
  {
    key: 'sno',
    display: 'S.No.',
    config: { isIndex: true },
  },
  {
    key: 'editBy',
    display: 'Edited By',
    sort: true,
  },
  {
    key: 'updatedOnDate',
    display: 'Edited Date',
    sort: true,
    config: { isDate: true, format: 'dd-MM-yyyy' },
  },
  {
    key: 'actionRemarks',
    display: 'Remark',
    sort: true,
  },
  {
    key: 'status',
    display: 'Status',
    sort: true,
    config: { isStatus: true },
  },
];

export const GENDER_DATA = [
  { id: 13, name: 'Male' },
  { id: 14, name: 'Female' },
  { id: 23, name: 'Unisex' },
];

export const PRICE_TYPE = [
  { id: 28, name: 'MRP', checked: false },
  { id: 29, name: 'Variable', checked: true },
];
export const PUBLISHED_ID = [
  { id: 21, name: 'Published' },
  { id: 22, name: 'Unpublished' },
];
export const APPLY_CONDITION = [
  { id: 33, name: 'Optional' },
  { id: 32, name: 'Mandatory' },
];
export const RELATIONSHIP_STATUS = [
  { id: 30, name: 'Married' },
  { id: 31, name: 'UnMarried' },
];
export const USER_TYPE = {
  VENDOR: 34,
  EMPLOYEE: 35,
  SELLER: 36,
  COMPANY: 37,
  ADMIN: 3,
  CUSTOMER: 4,
};
export const USER_STATUS_ENUM_ID = {
  PENDING: 16,
  APPROVED: 17,
  REJECTED: 18,
};
export const INDIA_CODE = 2;

export const ACTIVE_DE_ACTIVE_STATUS_ID = {
  ACTIVE: 1,
  DEACTIVE: 2,
  ALL: 0,
};
export const APP_TYPE_STATUS_ID = [
  {
    id: 23,
    name: 'Web',
  },
  {
    id: 24,
    name: 'Mobile',
  },
];

export const STONE_TYPE_ID = [
  {
    id: 45,
    title: 'Artificial',
  },
  {
    id: 44,
    title: 'Precious',
  },
];

export const SIZEMASTER = {
  METALGEM: 49,
  STONE: 48,
};

export const SIZEMASTERARRAY = [
  { id: 49, title: 'METAL' },

  {
    id: 48,
    title: 'GEMSTONE',
  },
];

export const UNITGROUPID = {
  LENGHT: 1,
  DAY: 2,
  WEIGHT: 3,
  STONE: 4,
  GRADE: 5,
};

// For Map Defualt Parameter
export const MapDrawObjectRectangle = 53;
export const MapDrawObjectPolygon = 52;
export const MapDrawObjectCircle = 51;
export const MapDrawObjectMarker = 50;
export const MapZoom = 15;
export const CityMapZoom = 11;
export const AreaMapZoom = 12;

export const DataNotAvailable = 'Data not Available';
export const HistoryDropDownData = [
  {
    id: 1,
    name: 'available',
    displayName: 'Available',
  },
  {
    id: 2,
    name: 'not available',
    displayName: 'Not Available',
  },
  {
    id: 3,
    name: 'both',
    displayName: 'Both',
  },
];

export const AreafillColor = '#FF0000'; //#ffff00' // area Drawing color  red
export const CityfillColor = '#000000'; // city Drawing color black
export const ShiftZone = 'Transfer Zone';

export const iconLabelColor = '#3e3e3e';
export const ActiveOrDeactive = 'activeOrDeactive'; // for fare plan

export const ActiveOrDeactiveButton = 'Active'; // status button global table

export const Publish = 'Publish';
export const PublishEnumId = 87;
export const UnublishEnumId = 88;

export const geoOut = 63;
export const geoIn = 62;

export const AREATYPE = 'Area Type';

export const VehicleType = 'VehicleType';
export const BatteryType = 'BatteryType';
export const FrameType = 'FrameType';
export const BrakeType = 'BreakType';
export const Accessories = 'VehicleAccessories';

export const UnderMaintenance = 'UnderMaintenance';
export const Active = 'Active Ride';
export const Available = 'Available';

export const redBike = 'bicycle-red.png';
export const redBike_L = 'locate/bicycle-red-l.png';

export const blackBike = 'bicycle-black.png';
export const blackBike_L = 'locate/bicycle-black-l.png';

export const greenBike = 'bicycle-green.png';
export const greenBike_L = 'locate/bicycle-green-l.png';

export const blueBike = 'bicycle-blue.png';
export const blueBike_L = 'locate/bicycle-blue-l.png';

export const yellowBike = 'bicycle-yellow.png';
export const yellowBike_L = 'locate/bicycle-yellow-l.png';

export const fe_request_from_admin = 65;
// export const fe_request_fromAdmin = 65

export const fe_action_add = 'add';

export const fe_action_edit = 'edit';

export const ForMobileImage = 79;
export const ForAdminImage = 78;

export const DeviceRegister = "Device Register Can't Edit or Delete. ";

export const ReplyCommentsStatus = 'ReplyCommentsStatus';

export const REPLY = 'Reply';
export const FAQ = 'FAQPublishStatus';
export const ReOrder = 'ReOrder';

export const ParkingZoneIcon = 'bike-parking-3.png';
export const ParkingZoneIconNoBike = 'no-bike-zone.png';


export const ClientEvegah = 'Evegah';
export const ClientMetro = 'metroemobility';
