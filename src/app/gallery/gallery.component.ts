import { GalleryService } from './gallery.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from './../app.component';
import { VigenereCipherService } from './../vigenere-cipher.service';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Galleria } from 'primeng/galleria';

import { UserService } from '../user/user.service';
import { PhotoService } from '../user/photo.service';

// import {  delay } from 'rxjs/operators';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  exploreCards = [];
  maxFileSize: number = 1000000;
  uploadedFiles: any[] = [];
  formUploadPic: FormGroup;
  userId;
  username;
  avatar;
  onload = false;
  images;

  showThumbnails: boolean;

  fullscreen: boolean = false;

  activeIndex: number = 0;

  onFullScreenListener: any;

  @ViewChild('galleria') galleria: Galleria;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private vigenereCipherService: VigenereCipherService,
    private app: AppComponent,
    private router: Router,
    private messageService: MessageService,
    private photoService: PhotoService,
    private cd: ChangeDetectorRef,
    private galleryService: GalleryService
  ) {
    console.log("status", this.app.cookieService.get("status"));
    this.formUploadPic = this.fb.group({
      pic: [''],
      pics: [''],
    });

    if (this.app.cookieService.check('auth-token')) {
      this.getInforUser();

      // this.user.emit();
    } else {
      // window.alert("here is else");
      this.onload = false;
      this.router.navigate(['']);
    }
  }
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  async ngOnInit() {
    var res = this.photoService.getImages().then((images) => {
      this.images = images;
    });
    await console.log(this.images);
    await console.log(res);
    this.bindDocumentListeners();
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
  async onSelectedFile(e) {
    this.onload = true;
    console.log(e);
    var pic;

    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = async (event: any) => {
        pic = event.target.result;
      };
    }
    await this.delay(1000);

    this.upPic(pic);
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async upPic(pic) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        picture: pic,
      },
    };
    console.log(pic);
    var res = this.galleryService.uploadPic(data);
    console.log(res);
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
        detail: 'Uploaded picture successfully',
      });
    } else {
      this.onload = false;
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Uploaded picture unsuccessfully',
      });
      // setTimeout(() => { }, 500);
    }
  }
  async onUpload(event) {
    this.onload = true;
    // console.log("ev", event);
    // for(let file of event.files) {
    //     this.uploadedFiles.push(file);
    // }
    // console.log("files", this.uploadedFiles);
    // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    var uploadFiles = [];
    for (let file of event.files) {
      var base64data;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64data = reader.result;
      };
      // var upFile = await this.readFiles(file);
      // console.log("readFile", this.readFiles(file));
      await this.delay(500);

      uploadFiles.push(base64data);
    }

    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        userId: this.userId,
        pictures: uploadFiles,
      },
    };
    var res = this.galleryService.uploadPics(data);

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
        detail: 'Uploaded picture successfully',
      });
    } else {
      this.onload = false;
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Uploaded picture unsuccessfully',
      });
      // setTimeout(() => { }, 500);
    }
  }

  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
    if (this.fullscreen) {
      this.closePreviewFullScreen();
    } else {
      this.openPreviewFullScreen();
    }
    this.cd.detach();
  }

  openPreviewFullScreen() {
    let elem = this.galleria.element.nativeElement.querySelector('.p-galleria');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem['mozRequestFullScreen']) {
      /* Firefox */
      elem['mozRequestFullScreen']();
    } else if (elem['webkitRequestFullscreen']) {
      /* Chrome, Safari & Opera */
      elem['webkitRequestFullscreen']();
    } else if (elem['msRequestFullscreen']) {
      /* IE/Edge */
      elem['msRequestFullscreen']();
    }
  }

  onFullScreenChange() {
    this.fullscreen = !this.fullscreen;
    this.cd.detectChanges();
    this.cd.reattach();
  }

  closePreviewFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    }
  }

  bindDocumentListeners() {
    this.onFullScreenListener = this.onFullScreenChange.bind(this);
    document.addEventListener('fullscreenchange', this.onFullScreenListener);
    document.addEventListener('mozfullscreenchange', this.onFullScreenListener);
    document.addEventListener(
      'webkitfullscreenchange',
      this.onFullScreenListener
    );
    document.addEventListener('msfullscreenchange', this.onFullScreenListener);
  }

  unbindDocumentListeners() {
    document.removeEventListener('fullscreenchange', this.onFullScreenListener);
    document.removeEventListener(
      'mozfullscreenchange',
      this.onFullScreenListener
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.onFullScreenListener
    );
    document.removeEventListener(
      'msfullscreenchange',
      this.onFullScreenListener
    );
    this.onFullScreenListener = null;
  }

  ngOnDestroy() {
    this.unbindDocumentListeners();
  }

  galleriaClass() {
    return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
    return `pi ${
      this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'
    }`;
  }
}
