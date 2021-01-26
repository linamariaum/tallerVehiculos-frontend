import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginEmlpoyeeComponent } from './components/login-emlpoyee/login-emlpoyee.component';
import { LoginOwnerComponent } from './components/login-owner/login-owner.component';
import { AuthService } from './services/auth.service';
import { EmployeeTechnicalComponent } from './components/employee-technical/employee-technical.component';
import { EmployeeAssistantComponent } from './components/employee-assistant/employee-assistant.component';
import { EmployeeDialog } from './components/employee-assistant/employeeDialog';
import { ProfileDialog } from './components/profile/profileDialog';
import { EmployeeSupervisorComponent } from './components/employee-supervisor/employee-supervisor.component';
import { OwnerDialogNo } from './components/employee-supervisor/ownerDialog';
import { OwnerDialog } from './components/ownerDialog/owner-dialog'
import { OwnerInfoDialog } from './components/ownerDialog/ownerInfo'
import { from } from 'rxjs';
import { OwnerComponent } from './components/owner/owner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ProfileComponent,
    LoginOwnerComponent,
    LoginEmlpoyeeComponent,
    EmployeeTechnicalComponent,
    EmployeeAssistantComponent,
    EmployeeDialog,
    ProfileDialog,
    OwnerDialogNo,
    OwnerDialog,
    EmployeeSupervisorComponent,
    OwnerInfoDialog,
    OwnerComponent
  ],
  entryComponents: [
    EmployeeDialog,
    ProfileDialog,
    OwnerDialogNo,
    OwnerDialog,
    OwnerInfoDialog
  ],
  imports: [
    MatCheckboxModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatGridListModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
