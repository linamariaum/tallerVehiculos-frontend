import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginEmlpoyeeComponent } from './components/login-emlpoyee/login-emlpoyee.component';
import { LoginOwnerComponent } from './components/login-owner/login-owner.component';
import { AuthService } from './services/auth.service';
import { EmployeeAssistantComponent } from './components/employee-assistant/employee-assistant.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ProfileComponent,
    LoginOwnerComponent,
    LoginEmlpoyeeComponent,
    EmployeeAssistantComponent
  ],
  imports: [
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
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
