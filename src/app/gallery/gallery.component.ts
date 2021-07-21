import { AppService } from './../app.service';
import { Router } from '@angular/router';
import { VigenereCipherService } from './../vigenere-cipher.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin } from 'rxjs';
import { config } from '../../config';

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
  likeImages: any = [];
  displayPosition: boolean = false;
  hoveredItem;
  position: string;
  loading;
  constructor(
    private fb: FormBuilder,
    private vigenereCipherService: VigenereCipherService,
    private cookieService: CookieService,
    private router: Router,
    private service: AppService
  ) {
    this.formUploadPic = this.fb.group({
      pic: [''],
      pics: [''],
    });
  }

  async ngOnInit() {
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.userId = this.user.id;
    this.username = this.user.name;
    this.avatar = this.user.avatar;
    if (this.avatar === '' || this.username === '') {
      this.position = 'top';
      this.displayPosition = true;
    }

    this.getAllListImages(
      this.getPostedPicturesByUserId(),
      this.getLikedPosts(),
      this.getUploadedPicturesByUserId()
    ).then((listOfListPic) => {
      setTimeout(() => {
        this.postedImages = listOfListPic.shift();
        this.likeImages = listOfListPic.shift();
        this.uploadedImages = listOfListPic.shift();
      }, 500);
    });
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
        listItem.push(await this.getImages(await results[i++], 'post'));
        listItem.push(await this.getImages(await results[i++], 'post'));
        listItem.push(await this.getImages(await results[i++], 'upload'));
      }
    });

    return listItem;
  }
  async getUserByEmail() {
    var data = {
      'secret-key': config.verified_key,
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          config.auth_token_key,
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
  async getPostedPicturesByUserId() {
    var data = {
      'secret-key': config.verified_key,
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
      'secret-key': config.verified_key,
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
      'secret-key': config.verified_key,
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

  async updateUploadedPictures(ev) {
    if (ev === true) {
      this.getAllListImages(
        this.getPostedPicturesByUserId(),
        this.getLikedPosts(),
        this.getUploadedPicturesByUserId()
      ).then((listOfListPic) => {
        setTimeout(() => {
          this.postedImages = listOfListPic.shift();
          this.likeImages = listOfListPic.shift();
          this.uploadedImages = listOfListPic.shift();
        }, 500);
      });
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
  async getLikedPosts() {
    var data = {
      'secret-key': config.verified_key,
      body: {
        userId: this.user.id,
      },
    };
    var response = this.service.sendRequest('getlikedposts', data);
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
}
