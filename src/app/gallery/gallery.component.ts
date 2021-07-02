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

  user;
  uploadedImages: any = [];
  postedImages: any = [];
  displayPosition: boolean = false;
  hoveredItem;
  position: string;
  loading;
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

    if (this.cookie.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {}

  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async getInforUser() {
    await this.getUserByEmail();
    this.userId = this.user.id;
    this.username = this.user.name;
    this.avatar = this.user.avatar;
    if (this.avatar === '' || this.username === '') {
      this.position = 'top';
      this.displayPosition = true;
    }
    var listOfListPic = await this.getAllListImages(
      this.getPostedPicturesByUserId(),
      this.getUploadedPicturesByUserId()
    );
    await this.delay(500);

    this.postedImages = listOfListPic.shift();
    this.uploadedImages = listOfListPic.shift();
  }
  async getImages(listId, mode) {
    var images = [];
    for (var id in listId) {
      if (mode === 'post') {
        var request = this.getPictureById(listId[id].picId);
        forkJoin([request]).subscribe((results) => {
          images.push(results[0]);
        });
      } else if (mode === 'upload') {
        var request = this.getPictureById(listId[id].id);
        forkJoin([request]).subscribe((results) => {
          images.push(results[0]);
        });
      }
    }

    return images;
  }

  async getAllListImages(...args) {
    var listItem = [];
    var i = 0;
    forkJoin([...args]).subscribe(async (results) => {
      while (i < args.length) {
        if (i == 0) {
          listItem.push(await this.getImages(await results[i++], 'post'));
        } else {
          listItem.push(await this.getImages(await results[i++], 'upload'));
        }
      }
    });

    return listItem;
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
    this.setLoading(response);
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
    this.setLoading(response);
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
    this.setLoading(response);
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
    this.setLoading(response);
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
