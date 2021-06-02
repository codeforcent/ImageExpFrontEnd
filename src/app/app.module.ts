import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { NgSelect2Module } from 'ng-select2';
import {NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { JsonPipe } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import {TextFieldModule} from '@angular/cdk/text-field';
const routesConfig: Routes = [
  { path: 'userLogin', component: SigninComponent},
  { path: '', component: HomeComponent},
  { path: 'upload', component: UploadComponent}
];


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './user/user.component';
import { SigninComponent } from './signin/signin.component';
import { SocialLoginModule } from 'angularx-social-login';
import { ClickOutsideDirective } from './click-outside.directive';
import { ImageComponent } from './image/image.component';
import { UploadComponent } from './upload/upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    SigninComponent,
    ClickOutsideDirective,
    ImageComponent,
    UploadComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SocialLoginModule,
    MatProgressBarModule,
    NgbModule,
    TagInputModule,
    TextFieldModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(routesConfig),
    BrowserAnimationsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    JsonPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
