import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { JsonPipe, CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CookieService } from 'ngx-cookie-service';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
const routesConfig: Routes = [
  { path: 'userLogin', component: SigninComponent },
  { path: '', component: HomeComponent },
  { path: 'post', component: UploadComponent },
  {
    path: 'user/:id',
    component: UserComponent,
  },
  { path: 'settings', component: UserProfileComponent },
  { path: 'settings/user-profile', component: UserProfileComponent },
  { path: 'settings/change-password', component: ChangePasswordComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: '**', component: PageNotFoundComponent },
];

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './user/user.component';
import { SigninComponent } from './signin/signin.component';

import { ClickOutsideDirective } from './click-outside.directive';
import { ImageComponent } from './image/image.component';
import { UploadComponent } from './upload/upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsComponent } from './settings/settings.component';
import { UserService } from './user/user.service';
import { GalleryComponent } from './gallery/gallery.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

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
    UploadComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    SettingsComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MultiSelectModule,
    MatProgressBarModule,
    NgbModule,
    TagInputModule,
    TextFieldModule,
    MDBBootstrapModule,
    DragDropModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    FontAwesomeModule,
    GalleriaModule,
    PanelMenuModule,
    TabMenuModule,
    MenuModule,
    CommonModule,
    FileUploadModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(routesConfig),
    BrowserAnimationsModule,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [JsonPipe, CookieService, MessageService, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
