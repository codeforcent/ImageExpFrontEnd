import { Component, Input, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit {
  @Input() item;
  @Input() hovered;
  @ViewChild('gal_img') gal_img;
  btn_top: any;
  src: string;
  itemSelected = new EventEmitter<any>();

  selectedItem: any;
  constructor() {}

  ngOnInit(): void {}
  calHeight() {
    return this.gal_img?.nativeElement?.height - 50 + 'px';
  }
  calHeightIC() {
    return this.gal_img?.nativeElement?.height - 35 + 'px';
  }
}
