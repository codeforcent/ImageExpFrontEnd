import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
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
  listPostsContent;
  listPostCatId;
  prevSearchKey;
  prevSearchCat;
  searchKey;
  searchCat;
  constructor(
    private http: HttpClient,
    private service: AppService,
    private messageService: MessageService
  ) {
    this.searchContent = sessionStorage.getItem('key');
    this.searchCategoryId = sessionStorage.getItem('cat');
    sessionStorage.clear();
  }

  async ngOnInit() {
    if (this.searchContent !== null) {
      this.searchKey = true;
      this.searchCat = false;
      this.prevSearchKey = this.searchContent;
      this.searchByKey();
    } else if (this.searchCategoryId !== null) {
      this.searchKey = false;
      this.searchCat = true;
      this.prevSearchCat = this.searchCategoryId;
      this.listPostCatId = await this.getPostsByCategoryId();
    }
  }
  onOuputKey(event) {
    this.searchKey = true;
    this.searchCat = false;
    if (this.prevSearchKey !== event) {
      this.searchContent = event;
      this.prevSearchKey = event;
      this.searchByKey();
    }
  }
  async onOuputCat(event) {
    this.searchKey = false;
    this.searchCat = true;
    if (this.prevSearchCat !== event) {
      this.prevSearchCat = event;
      this.searchCategoryId = event;
      this.listPostCatId = await this.getPostsByCategoryId();
    }
  }
  async searchByKey() {
    var responses = await this.getListSymWords(this.searchContent);
    var listSymWords = [];
    listSymWords.push(this.searchContent);
    if (responses.toString() !== '') {
      var i = 0;
      for (var res in responses) {
        if (i < 9) {
          listSymWords.push(responses[res].word);
          i++;
        } else {
          break;
        }
      }
    }
    var listTempPosts = await this.searchByWords(listSymWords);
    await this.delay(1000);
    for (var i = 0; i < listTempPosts.length; i++) {
      if (listTempPosts[i].length === 0) {
        listTempPosts.splice(i, 1);
        i--;
      }
    }
    await this.delay(1000);
    this.listPostsContent = listTempPosts[0];
    if (this.listPostsContent === undefined) {
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'No results found',
      });
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async searchByWords(listWords) {
    var listResult = [];
    if (listWords.length > 10) {
      for (var i = 0; i < 10; i++) {
        var request = this.getPostsBySearchKey(listWords[i]);
        this.setLoading(request);
        forkJoin([request]).subscribe((results) => {
          listResult.push(results[0]);
        });
      }
    } else {
      for (var word in listWords) {
        var request = this.getPostsBySearchKey(listWords[word]);
        this.setLoading(request);
        forkJoin([request]).subscribe((results) => {
          listResult.push(results[0]);
        });
      }
    }

    return listResult;
  }
  onMouseover(item) {
    this.hoveredItem = item;
  }
  onMouseleave() {
    this.hoveredItem = null;
  }
  savePicture(ev) {
    if (ev === true) {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Save image successfully',
      });
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Save image unsuccessfully',
      });
    }
  }
  async getListSymWords(word) {
    var res = this.http.get('https://api.datamuse.com/words?rel_trg=' + word);
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
    this.setLoading(response);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response
    );
  }
  async getPostsByCategoryId() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: +this.searchCategoryId,
      },
    };
    var response = this.service.sendRequest('getpostsbycategoryid', data);
    this.setLoading(response);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response
    );
  }
}
