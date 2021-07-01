import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { UserService } from '../user/user.service';
import { GalleryService } from '../gallery/gallery.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.css'],
})
export class UploadImgComponent implements OnInit {
  @ViewChild('up') up;
  onload = false;
  uploadedFiles: any[] = [];
  userId;
  avatar;
  username;
  formUploadPic: FormGroup;
  displayPosition: boolean = false;

  position: string;
  constructor(
    private messageService: MessageService,
    private app: AppComponent,
    private vigenereCipherService: VigenereCipherService,
    private router: Router,
    private userService: UserService,
    private galleryService: GalleryService,
    private fb: FormBuilder
  ) {

    this.formUploadPic = this.fb.group({
      pics: ['']
    });
    this.onload = true;
    if (this.app.cookieService.check('auth-token')) {
      this.getInforUser();

      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.onload = false;
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {}
  async getInforUser() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.app.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        ),
      },
    };
    var res = this.userService.getInforUser(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => { }, 500);
      this.userId = await res.then(
        (__zone_symbol__value) =>
          (this.userId = __zone_symbol__value.body.response.id)
      );

      this.avatar = await res.then(
        (__zone_symbol__value) =>
          (this.avatar = __zone_symbol__value.body.response.avatar)
      );
      this.username = await res.then(
        (__zone_symbol__value) =>
          (this.username = __zone_symbol__value.body.response.name)
      );

      if (
       this.avatar === '' || this.username === ''
      ) {
        this.position = 'top';
        this.displayPosition = true;
        this.onload = false;
      }
      this.onload = false;
      // setTimeout(() => { }, 500);
      // this.app.userService.addUser(user);
      // sessionStorage.setItem(this.app.cookieService.get('auth-token'), user.getEmail());
      // this.router.navigate(['']);
    } else {
      // setTimeout(() => { }, 500);
      // this.onload = false;
      // this.signUpSuccess = false;

      this.app.cookieService.delete('auth-token');
      this.router.navigate(['']);
      this.onload = false;
    }
  }
  async onUpload(event) {
    this.onload = true;

    var uploadFiles = [];
    for (let file of event.files) {
      var base64data;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64data = reader.result;
      };

      await this.delay(500);

      uploadFiles.push(base64data);
    }
    console.log(uploadFiles);
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        pictures: uploadFiles,
      },
    };
    var res = this.galleryService.uploadPics(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {

      this.onload = false;
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Uploaded picture successfully',
      });
      this.up.clear();

    } else {
      this.onload = false;
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Uploaded picture unsuccessfully',
      });

    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  onClickDialog() {
    this.displayPosition = false;
    this.router.navigate(['/settings']);
  }
}
