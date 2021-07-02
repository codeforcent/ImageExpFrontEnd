import { UploadService } from './upload.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ViewChild, Input, NgZone } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { GalleryService } from '../gallery/gallery.service';
import { MessageService, SelectItem } from 'primeng/api';
import { AppService } from '../app.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('title') title;
  @ViewChild('des') des;
  @ViewChild('cate') cate;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input()
  formUpload: FormGroup;

  url: string;
  uploaded = false;
  scrollHeightTitle;
  scrollHeightDes;
  dropdownList = [];
  selectedItems = [];
  autocompleteItems = [
    // { display: 'Javascript', value: 'Javascript' },
    // { display: 'Typescript', value: 'Typescript' },
  ];
  dragAndDropObjects = [
    // { display: 'Javascript', value: 'Javascript' },
    // { display: 'Typescript', value: 'Typescript' },
    // { display: 'w', value: 'w' },
    // { display: 'a', value: 'a' },
  ];
  dropdownSettings: IDropdownSettings;
  title1 = '';
  charCount = 0;
  email;
  username;
  avatar;
  userId;
  img;
  picId;
  cates;
  keywords;
  cateList = [];
  onload = false;
  list;
  selectedCates = [];
  items: SelectItem[] = [];

  item: string;
  height;
  clicked = false;
  displayPosition: boolean = false;

  position: string;
  sub: any;
  listCateId = [];
  mode;
  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private app: AppComponent,
    private router: Router,
    private userService: UserService,
    private vigenereCipherService: VigenereCipherService,
    private uploadService: UploadService,
    private galleryService: GalleryService,
    private messageService: MessageService,
    private service: AppService
  ) {
    this.img = sessionStorage.getItem('img');
    this.picId = sessionStorage.getItem('id');
    this.mode = sessionStorage.getItem('mode');

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    this.formUpload = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      img: ['', [Validators.required]],
      cates: ['', Validators.required],
      des: ['', Validators.maxLength(250)],
      keywords: ['', Validators.required],
    });
    if (sessionStorage.getItem('title') !== null) {
      this.formUpload.setValue({
        title: sessionStorage.getItem('title'),
        img: this.img,
        cates: sessionStorage.getItem('cates'),
        des: sessionStorage.getItem('des'),
        keywords: sessionStorage.getItem('keyword'),
      });

      var list = sessionStorage.getItem('cateId').split(',');
      for (var item in list) {
        this.listCateId.push(+list[+item]);
      }
      list = sessionStorage.getItem('keyword').split(',');

      for (var item in list) {
        this.autocompleteItems.push({
          display: list[+item],
          value: list[+item],
        });
        this.dragAndDropObjects.push({
          display: list[+item],
          value: list[+item],
        });
        this.items.push({
          label: list[+item],
          value: list[+item],
        });
      }
      sessionStorage.clear();
    }

    this.onload = true;
    if (this.app.cookieService.check('auth-token')) {
      this.getInforUser();

      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.onload = false;
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {
    this.cateList = await this.getAllCategories();
    this.cateList.forEach((category) => this.dropdownList.push(category));

    this.selectedCates = await this.getSelectedListCategory(this.listCateId);
  }
  async getSelectedListCategory(listId) {
    var listItem = [];
    for (var id in listId) {
      var request = this.getCategoryById(listId[id]);
      forkJoin([request]).subscribe((results) => {
        listItem.push(results[0]);
      });
    }

    return listItem;
  }
  async getCategoryById(id) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: id,
      },
    };
    var response = this.service.sendRequest('getcategorybyid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    }
  }
  async ngAfterViewInit() {}
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async getInforUser() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.app.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
          false
        ),
      },
    };
    var res = this.userService.getInforUser(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => { }, 500);
      this.userId = await res.then(
        (__zone_symbol__value) =>
          (this.userId = __zone_symbol__value.body.response.id)
      );

      this.avatar = await res.then(
        (__zone_symbol__value) =>
          (this.avatar = __zone_symbol__value.body.response.avatar)
      );

      this.username = await res.then(
        (__zone_symbol__value) =>
          (this.username = __zone_symbol__value.body.response.name)
      );

      if (this.avatar === '' || this.username === '') {
        this.position = 'top';
        this.displayPosition = true;
        this.onload = false;
      }

      this.onload = false;
    } else {
      this.app.cookieService.delete('auth-token');
      this.router.navigate(['']);
      this.onload = false;
    }
  }
  async getAllCategories() {
    var res = await this.uploadService.getAllCategories();

    return res;
  }
  onSelectedFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.img = event.target.result;
      };
      this.uploaded = true;
    }
  }

  onItemSelect(item: any) {
    console.log('item', item);
  }
  onSelectAll(item: any) {
    console.log('item', item);
  }
  public onTagEdited(item) {
    console.log('tag edited: current value is ' + item);
  }
  onValueChange(ev) {
    this.charCount = ev.length;
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  async onPost() {
    this.onload = true;
    this.clicked = true;

    if (this.picId === null) {
      await this.onUploadPic();
    }

    var listCategoryId: number[] = [];
    for (var e in this.formUpload.get('cates').value) {
      listCategoryId.push(this.formUpload.get('cates').value[e].id);
    }

    var listKeywords: string[] = [];
    for (var k in this.formUpload.get('keywords').value) {
      listKeywords.push(this.formUpload.get('keywords').value[k].value);
    }

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        picId: +this.picId,
        title: this.formUpload.get('title').value,
        description: this.formUpload.get('des').value,
        categoryId: listCategoryId,
        keyword: listKeywords.join(','),
      },
    };
    var res = this.uploadService.uploadPost(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      this.onload = false;
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Uploaded your post successfully',
      });
    } else {
      // setTimeout(() => { }, 500);
    }
  }
  async onUpdate() {
    var listCategoryId: number[] = [];
    for (var e in this.formUpload.get('cates').value) {
      listCategoryId.push(this.formUpload.get('cates').value[e].id);
    }

    var listKeywords: string[] = [];
    for (var k in this.formUpload.get('keywords').value) {
      listKeywords.push(this.formUpload.get('keywords').value[k].value);
    }

    var id = +sessionStorage.getItem('id');

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        postId: id,
        title: this.formUpload.get('title').value,
        description: this.formUpload.get('des').value,
        categoryId: listCategoryId,
        keyword: listKeywords.join(','),
      },
    };

    var response = this.service.sendRequest('updatepost', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      sessionStorage.clear();
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Updated your post successfully',
      });
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Updated your post unsuccessfully',
      });
    }
  }
  async onUploadPic() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        picture: this.img,
      },
    };

    if (this.formUpload.valid) {
      var res = this.galleryService.uploadPic(data);

      // var token = (
      //   Math.floor(Math.random() * (999999 - 100000)) + 100000
      // ).toString();
      if (
        (await res.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        this.picId = await res.then(
          (__zone_symbol__value) =>
            (this.picId = __zone_symbol__value.body.response.picId)
        );
      } else {
        // setTimeout(() => { }, 500);
      }
    } else {
      this.onload = false;
    }
  }

  onClickDialog() {
    this.displayPosition = false;
    this.router.navigate(['/settings']);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    sessionStorage.clear();
  }
}
