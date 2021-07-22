import { Component, OnInit, HostListener } from '@angular/core';
import { ViewChild, NgZone } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { VigenereCipherService } from '../vigenere-cipher.service';
import { MessageService, SelectItem } from 'primeng/api';
import { AppService } from '../app.service';
import { forkJoin } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { config } from '../../config';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  formUpload: FormGroup;
  uploaded = false;
  dropdownList = [];
  selectedItems = [];
  autocompleteItems = [];
  dragAndDropObjects = [];
  dropdownSettings: IDropdownSettings;
  charCount = 0;
  username;
  avatar;
  userId;
  img;
  picId;
  cateList = [];
  selectedCates = [];
  items: SelectItem[] = [];
  clicked = false;
  displayPosition: boolean = false;
  position: string;
  listCateId = [];
  mode;
  loading;
  user;
  checkCookie;
  checkInfo;

  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private router: Router,
    private vigenereCipherService: VigenereCipherService,
    private messageService: MessageService,
    private service: AppService,
    private cookieService: CookieService
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
      cates: [''],
      des: ['', Validators.maxLength(250)],
      keywords: ['', [Validators.required]],
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
    }
  }
  /**
   * on init
   */
  async ngOnInit() {
    if (this.cookieService.check('auth-token')) {
      this.checkCookie = false;
      this.getInforUser();
    } else {
      this.displayPosition = true;
      this.position = 'top';
      this.checkCookie = true;
    }
    this.cateList = await this.getAllCategories();
    this.cateList.forEach((cate) => this.dropdownList.push(cate));
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
  async getCategoryById(id: any) {
    var data = {
      'secret-key': config.verified_key,
      body: {
        id: id,
      },
    };
    var response = this.service.sendRequest('getcategorybyid', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    }
  }

  async getInforUser() {
    this.user = await this.getUserByEmail();
    this.userId = this.user.id;
    this.avatar = this.user.avatar;
    this.username = this.user.name;
    if (this.avatar === '' || this.username === '') {
      this.position = 'top';
      this.displayPosition = true;
      this.checkInfo = true;
    }
  }
  async getAllCategories() {
    var response = this.service.sendRequest('getallcategories', '');
    this.setLoading(response);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body
    );
  }
  onSelectedFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      var fileExtension = e.target.files[0].type.toString().split('.').pop();
      if (
        fileExtension === 'image/bmp' ||
        fileExtension === 'image/gif' ||
        fileExtension === 'image/jpeg' ||
        fileExtension === 'image/png' ||
        fileExtension === 'image/tiff' ||
        fileExtension === 'image/webp'
      ) {
        reader.onload = (event: any) => {
          this.img = event.target.result;
        };
        this.uploaded = true;
      } else {
        this.messageService.add({
          key: 'smsg',
          severity: 'error',
          summary: 'Message',
          detail: 'Uploaded images is invalid',
        });
      }
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
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  async onPost() {
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
    if (
      this.picId !== null &&
      this.formUpload.get('title').valid &&
      this.formUpload.get('cates').valid &&
      this.formUpload.get('des').valid &&
      this.formUpload.get('keywords').valid
    ) {
      var data = {
        'secret-key': config.verified_key,
        body: {
          userId: this.userId,
          picId: +this.picId,
          title: this.formUpload.get('title').value,
          description: this.formUpload.get('des').value,
          categoryId: listCategoryId,
          keyword: listKeywords.join(','),
        },
      };
      var response = this.service.sendRequest('addpost', data);
      this.setLoading(response);
      console.log(response);
      if (
        (await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        this.messageService.add({
          key: 'smsg',
          severity: 'success',
          summary: 'Message',
          detail: await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.response.message
          ),
        });
        await setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        this.messageService.add({
          key: 'smsg',
          severity: 'error',
          summary: 'Message',
          detail: await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.response.message
          ),
        });
      }
    }
  }
  async onUpdate() {
    this.clicked = true;
    var listCategoryId: number[] = [];
    for (var e in this.formUpload.get('cates').value) {
      listCategoryId.push(this.formUpload.get('cates').value[e].id);
    }
    var listKeywords: string[] = [];
    for (var k in this.formUpload.get('keywords').value) {
      listKeywords.push(this.formUpload.get('keywords').value[k].value);
    }
    var id = +sessionStorage.getItem('id');
    console.log(this.formUpload);

    if (
      this.formUpload.valid &&
      this.formUpload.get('cates').value.length !== 0
    ) {
      var data = {
        'secret-key': config.verified_key,
        body: {
          postId: id,
          title: this.formUpload.get('title').value,
          description: this.formUpload.get('des').value,
          categoryId: listCategoryId,
          keyword: listKeywords.join(','),
        },
      };
      var response = this.service.sendRequest('updatepost', data);
      this.setLoading(response);
      var isSuccess = await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      );
      if (isSuccess) {
        sessionStorage.clear();
        this.messageService.add({
          key: 'smsg',
          severity: 'success',
          summary: 'Message',
          detail: await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.response.message
          ),
        });
        setTimeout(() => {
          this.router.navigate(['/gallery']);
        }, 1000);
      } else {
        this.messageService.add({
          key: 'smsg',
          severity: 'error',
          summary: 'Message',
          detail: await response.then(
            (__zone_symbol__value) => __zone_symbol__value.body.response.message
          ),
        });
      }
    }
  }
  async getUserByEmail() {
    var data = {
      'secret-key': config.verified_key,
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          config.auth_token_key,
          false
        ),
      },
    };
    var response = this.service.sendRequest('getuserbyemail', data);
    this.setLoading(response);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );
    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.cookieService.delete('auth-token');
      this.router.navigate(['']);
    }
  }
  setLoading(promise: Promise<any>) {
    this.loading = true;
    promise.then(() => (this.loading = false));
  }
  async onUploadPic() {
    var data = {
      'secret-key': config.verified_key,
      body: {
        userId: this.userId,
        picture: this.img,
      },
    };
    if (this.formUpload.valid) {
      var response = this.service.sendRequest('addpicture', data);
      this.setLoading(response);
      if (
        (await response.then(
          (__zone_symbol__value) => __zone_symbol__value.body.success
        )) === true
      ) {
        this.picId = await response.then(
          (__zone_symbol__value) =>
            (this.picId = __zone_symbol__value.body.response.picId)
        );
      } else {
      }
    } else {
    }
  }
  onClickDialog() {
    this.displayPosition = false;
    if (this.checkCookie) {
      this.router.navigate(['/userLogin']);
    } else if (this.checkInfo) {
      this.router.navigate(['/settings']);
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler() {
    window.sessionStorage.clear();
  }
}
