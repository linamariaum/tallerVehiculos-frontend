import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginOwnerComponent } from './components/login-owner/login-owner.component';
import { HomepageComponent } from './components/homepage/homepage.component';

const routes: Routes = [
  { path: 'login-owner', component: LoginOwnerComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'homepage' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
