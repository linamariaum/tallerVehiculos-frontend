import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'homepage' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
