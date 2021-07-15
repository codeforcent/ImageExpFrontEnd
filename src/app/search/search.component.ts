import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  loading;
  listPic;
  hoveredItem;
  userId;
  hoveredPin;
  constructor() {}

  ngOnInit(): void {}
  onMouseover(item) {
    console.log(item);
  }
  onMouseleave() {}
  savePicture(ev) {
    console.log(ev);
  }
}
