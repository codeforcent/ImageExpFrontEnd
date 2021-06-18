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
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
    console.warn('result', this.cateList);
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
      this.userId = res.then(
        (__zone_symbol__value) =>
          (this.userId = __zone_symbol__value.body.response.id)
      );

      this.avatar = res.then(
        (__zone_symbol__value) =>
          (this.avatar = __zone_symbol__value.body.response.avatar)
      );
      this.username = res.then(
        (__zone_symbol__value) =>
          (this.username = __zone_symbol__value.body.response.name)
      );

      if (
        await this.avatar.then(
          (__zone_symbol__value) => __zone_symbol__value === ''
        )
      ) {
        this.avatar =
          'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
      }
      this.onload = false;
      // setTimeout(() => { }, 500);
      // this.app.userService.addUser(user);
      // sessionStorage.setItem(this.app.cookieService.get('auth-token'), user.getEmail());
      // this.router.navigate(['']);
    } else {
      // setTimeout(() => { }, 500);
      // this.onload = false;
      // this.signUpSuccess = false;

      this.app.cookieService.delete('auth-token');
      this.router.navigate(['']);
      this.onload = false;
    }
  }
  async getAllCategories() {
    // var data = {
    //   'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
    //   body: {
    //     email: this.vigenereCipherService.vigenereCipher(
    //       this.app.cookieService.get('auth-token'),
    //       '24DJBWID328FNSU32Z',
    //       false
    //     ),
    //   },
    // };
    var res = await this.uploadService.getAllCategories();
    console.log('res', res);

    return res;
    // if (
    //   (await res.then(
    //     (__zone_symbol__value) => __zone_symbol__value.body.success
    //   )) === true
    // ) {
    //   // setTimeout(() => { }, 500);
    //   this.userId = res.then(
    //     (__zone_symbol__value) =>
    //       (this.userId = __zone_symbol__value.body.response.userId)
    //   );
    //   this.avatar = res.then(
    //     (__zone_symbol__value) =>
    //       (this.avatar = __zone_symbol__value.body.response.avatar)
    //   );
    //   this.username = res.then(
    //     (__zone_symbol__value) =>
    //       (this.username = __zone_symbol__value.body.response.name)
    //   );

    //   if (
    //     await this.avatar.then(
    //       (__zone_symbol__value) => __zone_symbol__value === ''
    //     )
    //   ) {
    //     this.avatar =
    //       'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
    //   }
    //   this.onload = false;
    //   // setTimeout(() => { }, 500);
    //   // this.app.userService.addUser(user);
    //   // sessionStorage.setItem(this.app.cookieService.get('auth-token'), user.getEmail());
    //   // this.router.navigate(['']);
    // } else {
    //   // setTimeout(() => { }, 500);
    //   // this.onload = false;
    //   // this.signUpSuccess = false;

    //   this.app.cookieService.delete('auth-token');
    //   this.router.navigate(['']);
    //   this.onload = false;
    // }
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
  // onKeyUpTitle() {
  //   console.log('height', this.scrollHeightTitle);
  //   this.scrollHeightTitle = this.title?.nativeElement?.scrollHeight;
  //   console.log('height', this.scrollHeightTitle);
  // }
  // onKeyUpDes() {
  //   this.scrollHeightDes = this.des?.nativeElement?.scrollHeight;
  // }
  // onKeyUpBSTitle(ev) {
  //   this.charCount = ev?.target?.value?.length;
  //   // console.warn("len", ev?.target?.value?.length);

  //   if (this.charCount % 27 === 0 && this.charCount > 0) {
  //     this.scrollHeightTitle -= 35;
  //   }
  // }

  // onKeyUpBSDes(type, size) {
  //   if (
  //     type.nativeElement?.value?.length % size === 0 &&
  //     type.nativeElement?.value?.length > 0
  //   ) {
  //     this.scrollHeightTitle -= 30;
  //   }
  // }
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
    console.log(this.formUpload);
    console.log("img", this.img);
    await this.onUploadPic();

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        picId: this.picId,
        title: this.title,
        description: this.des,
        categoryId: this.cates,
        keywords: this.keywords
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
  console.log("PicpICID", this.picId);
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
      console.log("upload ok");
      var res = this.galleryService.uploadPic(data);
      console.log(res);
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
    console.log("PicpICID", this.picId);
      } else {
        // setTimeout(() => { }, 500);
      }
    } else {
      // this.onload = false;
    }
  }
}
