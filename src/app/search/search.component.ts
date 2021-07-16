import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

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
  sub;
  searchContent;
  searchCategoryId;
  listSymWords;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private service: AppService
  ) {
    this.sub = this.route.paramMap.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.searchContent = params['q'];
      this.searchCategoryId = params['cat'];
    });
    // .params.subscribe((params) => {
    //   this.searchContent = params['q'];
    // });
  }

  async ngOnInit() {
    this.listSymWords = await this.getListSymWords(this.searchContent);
  }
  onMouseover(item) {
    console.log(item);
  }
  onMouseleave() {}
  savePicture(ev) {
    console.log(ev);
  }
  async getListSymWords(word) {
    var res = this.http.get('https://api.datamuse.com/words?rel_trg=' + word);
    res.subscribe((res) => console.log(res));
    // https://api.datamuse.com/words?rel_trg=cat
    // https://api.datamuse.com/sug?s=cat
    return await res.toPromise().then();
  }
  async getPostsBySearchKey(searchKey) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        searchKey: searchKey,
      },
    };
    var response = this.service.sendRequest('getpostsbysearchkey', data);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response
    );
  }
}
