import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MdbBtnDirective } from 'angular-bootstrap-md';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  exploreCards = [];
  constructor() {
    this.exploreCards = [
      {id: 1, src: 'https://data.whicdn.com/images/252447756/original.jpg', title: 'img1'},
      {id: 2, src: 'https://avatar-ex-swe.nixcdn.com/playlist/2015/03/23/1/0/e/8/1427099001196_500.jpg', title: 'img2'},
      {id: 3, src: 'https://hanayukichan.files.wordpress.com/2015/10/1257798871309782118.png?w=640', title: 'img3'},
      {id: 4, src: 'https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-images/920481102d0311e7a999e7b5135b7d88.jpg', title: 'img4'},
      {id: 5, src: 'https://i.ytimg.com/vi/H5ohDQ-umHM/maxresdefault.jpg', title: 'img5'},
      {id: 6, src: 'http://st.nhattruyen.com/data/comics/105/shigatsu-wa-kimi-no-uso-coda.jpg', title: 'img6'}
  ]
   }

  ngOnInit(): void {
    this.exploreCards = this.exploreCards.sort((a, b) => a.id - b.id);
  }

}
