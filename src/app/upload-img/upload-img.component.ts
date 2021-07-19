import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../app.service';
import { forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.css'],
})
export class UploadImgComponent implements OnInit {
  @ViewChild('up') up;
  uploadedFiles: any[] = [];
  userId;
  avatar;
  username;
  formUploadPic: FormGroup;
  displayPosition: boolean = false;
  position: string;
  loading;
  user;
  constructor(
    private messageService: MessageService,
    private vigenereCipherService: VigenereCipherService,
    private router: Router,
    private fb: FormBuilder,
    private service: AppService,
    private cookieService: CookieService
  ) {
    this.formUploadPic = this.fb.group({
      pics: [''],
    });

    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {}

  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.userId = this.user.id;
    this.avatar = this.user.avatar;
    this.username = this.user.name;
    if (this.avatar === '' || this.username === '') {
      this.position = 'top';
      this.displayPosition = true;
    }
  }
  async getUserByEmail() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        ),
      },
    };
    var response = this.service.sendRequest('getuserbyemail', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.cookieService.delete('auth-token');
      this.router.navigate(['']);
    }
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async onUpload(event) {
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
    this.addManyPictures(uploadFiles);
    this.up.clear();
  }
  async addPicture(pic) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        picture: pic,
      },
    };
    var response = this.service.sendRequest('addpicture', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: "Upload image successfully",
      });
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: "Upload image unsuccessfully",
      });
      return null;
    }
  }
  async addManyPictures(listPic) {
    for (var pic in listPic) {
      var request = this.addPicture(listPic[pic]);
      forkJoin([request]).subscribe();
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
