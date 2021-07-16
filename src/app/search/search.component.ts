import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
// import {  ActivatedRoute, Router } from '@angular/router';
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
  listPosts;
  constructor(
    private http: HttpClient,
    // private router: Router,
    private service: AppService,
    private messageService: MessageService // private cookieService: CookieService // private route: ActivatedRoute
  ) {
    this.searchContent = sessionStorage.getItem('key');
    this.searchCategoryId = sessionStorage.getItem('cat');
    sessionStorage.clear();
  }

  async ngOnInit() {
    if (this.searchContent !== null) {
      this.searchByKey();
    } else if (this.searchCategoryId !== null) {
    }
  }
  onOuputKey(event) {
    this.searchContent = event;
    this.searchByKey();
  }
  async onOuputCat(event) {
    this.searchCategoryId = event;
    console.log(this.searchCategoryId);
    this.listPosts = await this.getPostsByCategoryId();
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
    this.listPosts = listTempPosts[0];
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async searchByWords(listWords) {
    var listResult = [];
    if (listWords.length > 10) {
      for (var i = 0; i < 10; i++) {
        var request = this.getPostsBySearchKey(listWords[i]);
        forkJoin([request]).subscribe((results) => {
          listResult.push(results[0]);
        });
      }
    } else {
      for (var word in listWords) {
        var request = this.getPostsBySearchKey(listWords[word]);
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
  async getPostsByCategoryId() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.searchCategoryId,
      },
    };
    var response = this.service.sendRequest('getpostsbycategoryid', data);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response
    );
  }
}
