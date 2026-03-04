//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================


import { Routes, RouterModule } from '@angular/router';
export const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
  }

    
];
export const AppRoutingModule  = RouterModule.forRoot(routes, { useHash: true,  relativeLinkResolution: 'legacy' });
 // need to add preloading
