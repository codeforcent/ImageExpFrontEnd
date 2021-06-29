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
  @Output() deleted = new EventEmitter<boolean>();
  @ViewChild('gal_img') gal_img;

  btn_top: any;
  src: string;
  itemSelected = new EventEmitter<any>();

  selectedItem: any;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {}
  calHeight() {
    return this.gal_img?.nativeElement?.height - 50 + 'px';
  }
  calHeightIC() {
    return this.gal_img?.nativeElement?.height - 35 + 'px';
  }
  async saveImgToCookie(pic) {
    sessionStorage.setItem('img', pic);
  }
  async deleteImg(ev, id) {
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
  // private async getAllImages() {
  //   var dat = {
  //     'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
  //     body: {
  //       id: this.item.userId,
  //     },
  //   };

  //   this.images = await this.galleryService
  //     .getImagesByUserId(dat)
  //     .then((__zone_symbol__value) => __zone_symbol__value.body.response);
  //   console.log(this.images);
  // }
}
