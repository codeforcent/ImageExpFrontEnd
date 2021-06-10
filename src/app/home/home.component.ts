import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hoveredPin = false;
  hoveredItem;
  listSrc : any = [
  { src: "https://data.whicdn.com/images/252447756/original.jpg"},
  { src: "https://avatar-ex-swe.nixcdn.com/playlist/2015/03/23/1/0/e/8/1427099001196_500.jpg"},
  { src: "https://hanayukichan.files.wordpress.com/2015/10/1257798871309782118.png?w=640"},
  { src: "https://s3-ap-southeast-1.amazonaws.com/images.spiderum.com/sp-images/920481102d0311e7a999e7b5135b7d88.jpg"},
  { src: "https://i.ytimg.com/vi/H5ohDQ-umHM/maxresdefault.jpg"},
  { src: "http://st.nhattruyen.com/data/comics/105/shigatsu-wa-kimi-no-uso-coda.jpg"},
  { src: "https://avatar-ex-swe.nixcdn.com/playlist/2015/02/28/2/3/2/9/1425136101884_500.jpg"},
  { src: "https://i1.sndcdn.com/artworks-000428487834-xokjnv-t500x500.jpg"},
  { src: "https://image.hayghe.org/data/film/Your-Lie-in-April-1.jpg"},
  { src: "https://i0.wp.com/kristruong09.com/wp-content/uploads/2018/08/Shigatsu.wa_.Kimi_.no_.Uso_.600.18553451.jpg?fit=724%2C460&ssl=1"},
  { src: "https://img.vncdn.xyz/storage20/hh247/images/shigatsu-wa-kimi-no-uso-ova-f1221.jpg"},
  { src: "https://comuaxuan.files.wordpress.com/2016/09/8.jpg?w=809"},
  { src: "https://s199.imacdn.com/ta/2016/11/29/a44dc00189be18fe_4ab65ef8bf98b54c_17853514804125463143215.jpg"},
  { src: "https://i.pinimg.com/originals/7b/b1/43/7bb143671ea36a625bbbe30268c09217.png"},
  { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTenKquN0-OMR1Obsg40WA8RTTMD6NGEP43ew&usqp=CAU"},


];
  constructor() { }

  ngOnInit(): void {
  }
  onMouseover(item) {
    this.hoveredItem = item;
  }
  onMouseleave() {
    this.hoveredItem = null;
  }
}
