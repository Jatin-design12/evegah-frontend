// import { AngularFireMessaging } from '@angular/fire/messaging';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { Injectable } from '@angular/core';


// import { take } from 'rxjs/operators';

// import { BehaviorSubject } from 'rxjs'
// @Injectable()
// export class MessagingService {
//   currentMessage = new BehaviorSubject(null);
//   token:string
//   constructor(private angularFireMessaging: AngularFireMessaging,
//     private angularFireDB: AngularFireDatabase,
//     private angularFireAuth: AngularFireAuth,) {
//     // this.angularFireMessaging.messages.subscribe((res) => {
//     //   console.log('res from angular messaging', res);
//     // })
//     this.angularFireMessaging.messages.subscribe(
//       (_messaging: AngularFireMessaging) => {
//         _messaging.onMessage = _messaging.onMessage.bind(_messaging);
//         _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
//       }
//     )
//   }

//   updateToken(userId, token) {
//     // we can change this function to request our backend service
//     this.angularFireAuth.authState.pipe(take(1)).subscribe(
//       () => {
//         const data = {};
//         data[userId] = token
//         this.angularFireDB.object('fcmTokens/').update(data)
//       })
//   }
//   requestPermission(userId) {
//     this.angularFireMessaging.requestToken.subscribe(
//       (token) => {
//         console.log('token', token);
//         this.token = token;
//         // this.updateToken(userId, token);
//         sessionStorage.setItem('token', JSON.stringify(token));

//       },
//       (err) => {
//         console.log('Unable to get permission to notify.', err);
//       }
//     );
//   }
//   takePermission(){
//     this.angularFireMessaging.requestPermission.subscribe((res)=>{
// console.log('res from takePermission',res)
//     },err=>{
//       console.log('error from takePermission',err);
//     })
//   }
//   receiveMessage() {
//     this.angularFireMessaging.messages.subscribe(
//       (payload) => {
//         this.currentMessage.next(payload);
//       })
//   }
// }
