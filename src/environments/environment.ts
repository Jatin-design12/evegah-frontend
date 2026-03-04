// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:9002/api/', // local backend
  //  apiUrl: 'https://metroemobility.kritin.in/api/',
  firebase: {
    apiKey: 'AIzaSyDBHtpt26PtJkdGiuKhQ4uuLeGnDMTZywo',
    authDomain: 'jewelpartner-admin.firebaseapp.com',
    projectId: 'jewelpartner-admin',
    storageBucket: 'jewelpartner-admin.appspot.com',
    messagingSenderId: '653145867328',
    appId: '1:653145867328:web:c0e57ea902e5fe96268ba5',
    measurementId: 'G-WJYP96MTKL',
  },
  clientName: 'Evegah',
  autoLockUnlock: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
