import { AppService } from './../app.service';
import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  @Input() item;
  @Input() hovered;
  @Input() modeOverlay;
  @Input() posted;
  @Input() userId;
  @Output() deleted = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();
  @ViewChild('gal_img') gal_img;
  avatar;
  btn_top: any;
  src: string;
  itemSelected = new EventEmitter<any>();
  selectedItem: any;
  post;
  picture;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private service: AppService
  ) {}

  async ngOnInit() {
    await setTimeout(() => {
      console.log('item', this.item);
    }, 500);
    if (this.modeOverlay === 'search') {
      for (var it in this.item) {
        this.picture = await this.getPictureById(this.item[it].picId);
      }
    }
    if (this.posted) {
      this.post = await this.getPostByPicId();
      // console.log('inPost', this.post);
    }
    if (this.modeOverlay === 'user') {
      var us = await this.getUserById(this.item[0].userId);
      this.avatar = us.avatar;
    } else if (this.modeOverlay !== 'search') {
      // console.log('usrIs', this.item.userId);
      var us = await this.getUserById(this.item.userId);
      await setTimeout(() => {
        // console.log("us", us.avatar);
        this.avatar = us.avatar;
      }, 500);
    } else {
      console.log('userid', this.item.userId);
      var us = await this.getUserById(this.item.userId);
      await setTimeout(() => {
        // console.log("us", us.avatar);
        this.avatar = us.avatar;
      }, 1000);
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async getPostByPicId() {
    var data;
    if (this.modeOverlay === 'user') {
      data = {
        'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
        body: {
          id: this.item[0].id,
        },
      };
    } else {
      data = {
        'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
        body: {
          id: this.item.id,
        },
      };
    }

    var response = this.service.sendRequest('getpostbypicid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );

    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    }
  }
  calHeight() {
    return this.gal_img?.nativeElement?.height - 50 + 'px';
  }
  calHeightIC() {
    return this.gal_img?.nativeElement?.height - 35 + 'px';
  }
  saveUploadedImgToCookie(id, pic) {
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('img', pic);
  }
  savePostedImgToCookie(pic) {
    sessionStorage.setItem('title', this.post.title);
    sessionStorage.setItem('des', this.post.description);
    sessionStorage.setItem('id', this.post.id);
    sessionStorage.setItem('img', pic);
    sessionStorage.setItem('cateId', this.post.categoryId);
    sessionStorage.setItem('keyword', this.post.keyword);
    sessionStorage.setItem('mode', 'update');
  }
  async deleteImg(ev, id) {
    this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        var data = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            picId: id,
            userId: this.item.userId,
          },
        };
        var response = this.service.sendRequest('deletepicture', data);
        if (
          (await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.success
          )) === true
        ) {
          this.deleted.emit(true);
          this.messageService.add({
            key: 'smsg',
            severity: 'success',
            summary: 'Message',
            detail: 'Delete picture successfully',
          });
        } else {
          this.messageService.add({
            key: 'smsg',
            severity: 'error',
            summary: 'Message',
            detail: 'Delete picture unsuccessfully',
          });
        }
      },
      reject: () => {},
    });
  }
  async onSave() {
    var isSuccess = await this.addPicture(this.userId, this.item.picture);
    console.log('isS', isSuccess);
    this.saved.emit(isSuccess);
  }
  async addPicture(userId, picture) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: userId,
        picture: picture,
      },
    };
    var response = this.service.sendRequest('addpicture', data);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
  }
  async getUserById(id: number) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: id,
      },
    };
    var response = this.service.sendRequest('getuserbyid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    }
  }
  async deletePost(ev) {
    this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        var data = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            postId: this.post.id,
            userId: this.item.userId,
          },
        };
        var response = this.service.sendRequest('deletepostforuser', data);
        if (
          (await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.success
          )) === true
        ) {
          this.deleted.emit(true);
          this.messageService.add({
            key: 'smsg',
            severity: 'success',
            summary: 'Message',
            detail: 'Delete post successfully',
          });
        } else {
          this.messageService.add({
            key: 'smsg',
            severity: 'error',
            summary: 'Message',
            detail: 'Delete post unsuccessfully',
          });
        }
      },
      reject: () => {},
    });
  }
  async deleteLikePost(ev) {
    this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        var data = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            postId: this.post.id,
            userId: this.item.userId,
          },
        };
        var response = this.service.sendRequest('togglelike', data);
        if (
          (await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.success
          )) === true
        ) {
          this.deleted.emit(true);
          this.messageService.add({
            key: 'smsg',
            severity: 'success',
            summary: 'Message',
            detail: 'Delete post successfully',
          });
        } else {
          this.messageService.add({
            key: 'smsg',
            severity: 'error',
            summary: 'Message',
            detail: 'Delete post unsuccessfully',
          });
        }
      },
      reject: () => {},
    });
  }
  async getPictureById(id) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: id,
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
    }
  }
}
