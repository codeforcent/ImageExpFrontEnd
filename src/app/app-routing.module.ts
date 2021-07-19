import { UploadImgComponent } from './upload-img/upload-img.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SigninComponent } from './signin/signin.component';
import { UploadComponent } from './upload/upload.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user/user.component';
import { PostdetailComponent } from './postdetail/postdetail.component';
import { SearchComponent } from './search/search.component';
const routes: Routes = [
  { path: 'userLogin', component: SigninComponent },
  { path: '', component: HomeComponent },
  { path: 'post', component: UploadComponent},
  {
    path: 'user/:id',
    component: UserComponent,
  },
  { path: 'settings', component: UserProfileComponent },
  { path: 'settings/user-profile', component: UserProfileComponent },
  { path: 'settings/change-password', component: ChangePasswordComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'uploadImg', component: UploadImgComponent },
  { path: 'postDetail/:id', component: PostdetailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'assets/config.json', redirectTo: '**', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
