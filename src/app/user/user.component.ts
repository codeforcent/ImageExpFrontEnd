import { Router } from '@angular/router';
import { VigenereCipherService } from './../vigenere-cipher.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  username;
  avatar;
  loading;
  id: number;
  sub: any;
  otherUser;
  user;
  postedImages: any = [];
  hoveredItem;
  likedImages;
  displayPosition;
  position;
  auth_token_key;
  verified_key;
  constructor(
    private vigenereCipherService: VigenereCipherService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private service: AppService,
    private http: HttpClient
  ) {
    this.http
      .get('assets/config.json', { responseType: 'json' })
      .subscribe((data) => {
        this.verified_key = data[0].verifiedkey;
        this.auth_token_key = data[2].authtokenkey;
      });
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });
  }

  async ngOnInit() {
    if (this.cookieService.check('auth-token')) {
      this.getInforUsers();
    } else {
      this.displayPosition = true;
    }
    var listOfListPic = await this.getAllListImages(
      this.getPostedPicturesByUserId(),
      this.getLikedPosts()
    );

    setTimeout(() => {
      this.postedImages = listOfListPic.shift();
      this.likedImages = listOfListPic.shift();
    }, 500);
  }

  async getInforUsers() {
    this.user = await this.getUserByEmail();
    if (this.user.id === this.id) {
      this.router.navigate(['/gallery']);
    }
    this.otherUser = await this.getUserById(this.id);
    this.username = this.otherUser.name;
    this.avatar = this.otherUser.avatar;
  }
  async getUserByEmail() {
    var data = {
      'secret-key': this.verified_key,
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          this.auth_token_key,
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
  async getUserById(id: number) {
    var data = {
      'secret-key': this.verified_key,
      body: {
        id: id,
      },
    };
    var response = this.service.sendRequest('getuserbyid', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.router.navigate(['']);
    }
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  onMouseover(item) {
    this.hoveredItem = item;
  }
  onMouseleave() {
    this.hoveredItem = null;
  }
  async getPostedPicturesByUserId() {
    var data = {
      'secret-key': this.verified_key,
      body: {
        id: this.id,
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
  async getListImages(listPost) {
    var listItem = [];
    for (var post in listPost) {
      var request = this.getPictureById(listPost[post].picId);
      forkJoin([request]).subscribe((result) => {
        listItem.push(result);
      });
    }
    return listItem;
  }
  async getPictureById(picId) {
    var data = {
      'secret-key': this.verified_key,
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
  async getLikedPosts() {
    var data = {
      'secret-key': this.verified_key,
      body: {
        userId: this.id,
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
  async getAllListImages(...args) {
    var listItem = [];
    var i = 0;
    forkJoin([...args]).subscribe(async (results) => {
      while (i < args.length) {
        listItem.push(await this.getListImages(await results[i++]));
        listItem.push(await this.getListImages(await results[i++]));
      }
    });
    return listItem;
  }
  onClickDialog() {
    this.displayPosition = false;
    this.router.navigate(['/userLogin']);
  }
}
