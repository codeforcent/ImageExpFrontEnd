import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  listSymWords = [];
  listPosts;
  constructor(
    private http: HttpClient,
    private router: Router,
    private service: AppService,
    private messageService: MessageService
  ) {
    this.searchContent =
      this.router.getCurrentNavigation().extras.queryParams.q;
    this.searchCategoryId =
      this.router.getCurrentNavigation().extras.queryParams.cat;

    // .params.subscribe((params) => {
    //   this.searchContent = params['q'];
    // });
  }

  async ngOnInit() {
    if (this.searchContent !== undefined) {
      var responses = await this.getListSymWords(this.searchContent);
      this.listSymWords.push(this.searchContent);
      if (responses.toString() !== '') {
        var i = 0;
        for (var res in responses) {
          if (i < 10) {
            this.listSymWords.push(responses[res].word);
            i++;
          } else {
            break;
          }
        }
      }
      var listTempPosts = await this.searchByWords(this.listSymWords);
      await this.delay(1000);
      for (var i = 0; i < listTempPosts.length; i++) {
        if (listTempPosts[i].length === 0) {
          listTempPosts.splice(i, 1);
          i--;
        }
      }
      this.listPosts = listTempPosts;
    } else if (this.searchCategoryId !== undefined) {
      this.listPosts = await this.getPostsByCategoryId();
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async searchByWords(listWords) {
    var listResult = [];
    // console.log('word', listWords);
    if (listWords.length > 10) {
      for (var i = 0; i < 10; i++) {
        var request = this.getPostsBySearchKey(listWords[i]);
        forkJoin([request]).subscribe((results) => {
          listResult.push(results[0]);
        });
      }
    } else {
      for (var word in listWords) {
        // console.log('word', listWords[word]);
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
