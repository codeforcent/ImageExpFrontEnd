import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  hoveredPin = false;
  hoveredItem;

  constructor() {}

  ngOnInit(): void {}
  onMouseover(item) {
    this.hoveredItem = item;
  }
  onMouseleave() {
    this.hoveredItem = null;
  }
  async getAllPost() {
    // var data = {
    //   'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
    //   body: {
    //     id: this.item.id,
    //   },
    // };
    // var response = this.service.sendRequest('getpostbypicid', data);
    // var isSuccess = await response.then(
    //   (__zone_symbol__value) => __zone_symbol__value.body.success
    // );
    // if (isSuccess) {
    //   this.post = await response.then(
    //     (__zone_symbol__value) => __zone_symbol__value.body.response
    //   );
    // }
  }
}
