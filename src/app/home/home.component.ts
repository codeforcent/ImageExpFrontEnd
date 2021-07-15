import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { AppService } from '../app.service';
import { VigenereCipherService } from '../vigenere-cipher.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  hoveredPin = false;
  hoveredItem;
  listPic: any[];
  loading;
  user;
  userId;
  constructor(
    private service: AppService,
    private cookieService: CookieService,
    private vigenereCipherService: VigenereCipherService,
    private router: Router,
    private messageService: MessageService
  ) {
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {}
  async getInforUser() {
    // const isMe = (element) => element.userId === this.userId;
    this.user = await this.getUserByEmail();
    this.userId = this.user.id;
    var listId = await this.getAllPost();
    // if (this.user !== null) {
    //   if (listId.findIndex(isMe) > -1) {
    //     listId.splice(listId.findIndex(isMe), 1);
    //   }
    // }

    this.listPic = await this.getPicture(listId);
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
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  onMouseover(item) {
    this.hoveredItem = item;
  }
  onMouseleave() {
    this.hoveredItem = null;
  }
  async getAllPost() {
    var response = this.service.sendRequest('getallposts', '');
    this.setLoading(response);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body
    );
  }
  async getPicture(listId) {
    var images = [];
    for (var id in listId) {
      var request = this.getPictureById(listId[id].picId);
      forkJoin([request]).subscribe((results) => {
        images.push(results[0]);
      });
    }
    await this.delay(1000);
    return images;
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
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  savePicture(ev) {
    if (ev === true) {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Save image successfully',
      });
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Save image unsuccessfully',
      });
    }
  }
}
