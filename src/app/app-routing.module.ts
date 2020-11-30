import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginOwnerComponent } from './components/login-owner/login-owner.component';
import { LoginEmlpoyeeComponent } from './components/login-emlpoyee/login-emlpoyee.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { EmployeeAssistantComponent } from './components/employee-assistant/employee-assistant.component';
import { EmployeeSupervisorComponent } from './components/employee-supervisor/employee-supervisor.component';

const routes: Routes = [
  { path: 'employee-assistant', component: EmployeeAssistantComponent },
  { path: 'employee-supervisor', component: EmployeeSupervisorComponent },
  { path: 'login-owner', component: LoginOwnerComponent },
  { path: 'login-emlpoyee', component: LoginEmlpoyeeComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'homepage' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
