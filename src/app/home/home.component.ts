import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AppService } from '../app.service';

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
  constructor(private service: AppService) {}

  async ngOnInit() {
    var listId = await this.getAllPost();
    console.log('l', listId);
    this.listPic = await this.getPicture(listId);
    await this.delay(500);
    const isNull = (element) => element === null;
    this.listPic.splice(this.listPic.findIndex(isNull), 1);
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
}
