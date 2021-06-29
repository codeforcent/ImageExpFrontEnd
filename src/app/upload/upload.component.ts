import { UploadService } from './upload.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit, AfterViewInit {
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
    { display: 'Javascript', value: 'Javascript' },
    { display: 'Typescript', value: 'Typescript' },
  ];
  dragAndDropObjects = [
    { display: 'Javascript', value: 'Javascript' },
    { display: 'Typescript', value: 'Typescript' },
    { display: 'w', value: 'w' },
    { display: 'a', value: 'a' },
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
  items: SelectItem[];

  item: string;
  height;
  clicked = false;
  displayPosition: boolean = false;

  position: string;
  sub: any;
  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private app: AppComponent,
    private router: Router,
    private userService: UserService,
    private vigenereCipherService: VigenereCipherService,
    private uploadService: UploadService,
    private galleryService: GalleryService,
    private messageService: MessageService
  ) {
    this.img = sessionStorage.getItem('img');
    sessionStorage.removeItem('img');

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
  }
  onChange() {
    console.warn('we', this.selectedCates);
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
    console.log('res', res);

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

    await this.onUploadPic();

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        picId: this.picId,
        title: this.title,
        description: this.des,
        categoryId: this.cates,
        keywords: this.keywords,
      },
    };
    var res = this.uploadService.uploadPost(data);

    if (
      (await res.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      // setTimeout(() => { }, 500);

      // var user = new User(
      //   token,
      //   this.formSignUp.get('email').value,
      //   '',
      //   '',
      //   1
      // );
      // this.app.userService.addUser(user);

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
        // setTimeout(() => { }, 500);

        // var user = new User(
        //   token,
        //   this.formSignUp.get('email').value,
        //   '',
        //   '',
        //   1
        // );
        // this.app.userService.addUser(user);
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
}
