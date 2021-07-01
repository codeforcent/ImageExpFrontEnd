import { AppService } from './../app.service';
import { Router } from '@angular/router';

import { VigenereCipherService } from './../vigenere-cipher.service';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  exploreCards = [];
  maxFileSize: number = 1000000;

  formUploadPic: FormGroup;
  userId;
  username;
  avatar;
  onload = false;
  user;
  uploadedImages;
  postedImages: any = [];
  showThumbnails: boolean;

  fullscreen: boolean = false;

  activeIndex: number = 0;

  onFullScreenListener: any;
  displayPosition: boolean = false;
  hoveredItem;
  position: string;

  constructor(
    private fb: FormBuilder,

    private vigenereCipherService: VigenereCipherService,
    private cookie: CookieService,
    private router: Router,

    private service: AppService
  ) {
    this.formUploadPic = this.fb.group({
      pic: [''],
      pics: [''],
    });
    this.onload = true;
    if (this.cookie.check('auth-token')) {
      this.getInforUser();
    } else {
      this.onload = false;
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {}
  uniqueArray2(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
      if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i]);
    console.log('arr', a);
    return a;
  }
  getUnique(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    console.log('getUniqe', newArray);
    return newArray;
  }
  async getInforUser() {
    await this.getUserByEmail();
    this.userId = this.user.id;
    this.username = this.user.name;
    this.avatar = this.user.avatar;
    if (this.avatar === '' || this.username === '') {
      this.position = 'top';
      this.displayPosition = true;
      this.onload = false;
    }
    await this.getAllListImages();

    this.onload = false;
  }
  async getImages(listId) {
    var images = [];
    for (var id in listId) {
      var request = this.getPictureById(listId[id].id);
      forkJoin([request]).subscribe((results) => {
        images.push(results[0]);
      });
    }
    return images;
  }

  async getAllListImages() {
    var list1 = this.getPostedPicturesByUserId();
    var list2 = this.getUploadedPicturesByUserId();
    forkJoin([list1, list2]).subscribe(async (results) => {
      this.postedImages = await this.getImages(results[0]);
      this.uploadedImages = await this.getImages(results[1]);
    });
  }
  async getUserByEmail() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookie.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        ),
      },
    };
    var response = this.service.sendRequest('getuserbyemail', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      this.user = await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.cookie.delete('auth-token');
      this.router.navigate(['']);
    }
  }
  async getPostedPicturesByUserId() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.userId,
      },
    };
    var response = this.service.sendRequest('getpostsbyuserid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    }
  }

  private async getUploadedPicturesByUserId() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.userId,
        'with-content': false,
      },
    };
    var response = this.service.sendRequest('getpicturesbyuserid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    }
  }

  async getPictureById(picId) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: picId,
      },
    };
    var response = this.service.sendRequest('getpicturebyid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      return null;
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async updateUploadedPictures(ev) {
    if (ev === true) {
      this.getAllListImages();
    }
  }

  onClickDialog() {
    this.displayPosition = false;
    this.router.navigate(['/settings']);
  }
  onMouseover(item) {
    this.hoveredItem = item;
  }
  onMouseleave() {
    this.hoveredItem = null;
  }
}
