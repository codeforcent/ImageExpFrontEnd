import { AppService } from './../app.service';
import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GalleryService } from '../gallery/gallery.service';
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
  @Output() deleted = new EventEmitter<boolean>();
  @ViewChild('gal_img') gal_img;

  btn_top: any;
  src: string;
  itemSelected = new EventEmitter<any>();

  selectedItem: any;
  post;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private galleryService: GalleryService,
    private service: AppService
  )
  {
    console.log("item", this.item);
    console.log("modeOverlay", this.modeOverlay);
    console.log("posted", this.posted);
  }

  async ngOnInit() {
    if (this.posted) {
      this.post = await this.getPostByPicId();

    }

  }
  async getPostByPicId() {
    console.log('id', this.item.id);
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.item.id,
      },
    };
    var response = this.service.sendRequest('getpostbypicid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    console.log(isSuccess);
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
    console.log("post", this.post);
    sessionStorage.setItem('title', this.post.title);
    sessionStorage.setItem('des', this.post.description);
    sessionStorage.setItem('id', this.post.id);
    sessionStorage.setItem('img', pic);

    sessionStorage.setItem('cateId', this.post.categoryId);
    sessionStorage.setItem('keyword', this.post.keyword);
    sessionStorage.setItem('mode', 'update');
  }
  async deleteImg(ev, id) {
    console.log("id in delete",id);
    this.confirmationService.confirm({
      target: ev.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        //confirm action
        var data = {
          'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
          body: {
            picId: id,
            userId: this.item.userId,
          },
        };
        var res = this.galleryService.deletePic(data);
        if (
          (await res.then(
            (__zone_symbol__value) => __zone_symbol__value.body.success
          )) === true
        ) {
          // await this.getAllImages();
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
      reject: () => {
        //reject action
      },
    });
  }

}
