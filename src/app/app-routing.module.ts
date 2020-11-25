import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginOwnerComponent } from './components/login-owner/login-owner.component';
import { LoginEmlpoyeeComponent } from './components/login-emlpoyee/login-emlpoyee.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EmployeeAssistantComponent } from './components/employee-assistant/employee-assistant.component';

const routes: Routes = [
  { path: 'employee-assistant/:id', component: EmployeeAssistantComponent },
  { path: 'login-owner', component: LoginOwnerComponent },
  { path: 'login-emlpoyee', component: LoginEmlpoyeeComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'homepage' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
