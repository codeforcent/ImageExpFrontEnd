import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { VigenereCipherService } from '../vigenere-cipher.service';

@Component({
  selector: 'app-postdetail',
  templateUrl: './postdetail.component.html',
  styleUrls: ['./postdetail.component.css'],
})
export class PostdetailComponent implements OnInit {
  sub: Subscription;
  id: number;
  post;
  likeBtn = '../../assets/heart-removebg-preview.png';
  loading: boolean;
  picture: any;
  user: { id: any; avatar: string; username: string };
  displayPosition: boolean;
  position: string;
  postUser: any;
  likeCount: any;
  formComment: FormGroup;
  clicked = false;
  listComments;
  listOwnerComment;
  disabled;
  constructor(
    private route: ActivatedRoute,
    private service: AppService,
    private router: Router,
    private cookieService: CookieService,
    private vigenereCipherService: VigenereCipherService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });
    this.formComment = this.fb.group({
      content: ['', [Validators.required]],
    });
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {
    this.post = await this.getPostById();
    this.picture = await this.getPictureById(this.post.picId);
    this.postUser = await this.getUserById(this.post.userId);
    if (this.postUser === null) {
      this.router.navigate(['']);
    }
    await this.checkLike();
    this.likeCount = await this.countLike();
    this.listComments = await this.getCommentByPostId();
    this.listOwnerComment = await this.getListOwnerComment(this.listComments);
    console.log('listOwnerComment', this.listOwnerComment);
  }
  private async countLike() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        postId: this.id,
      },
    };
    var response = this.service.sendRequest('countlikes', data);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response
    );
  }

  private async checkLike() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        postId: this.id,
        userId: this.user.id,
      },
    };
    var response = this.service.sendRequest('checklike', data);
    var isLiked = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response.isLiked
    );
    if (isLiked) {
      this.likeBtn = '../../assets/heart__1_-removebg-preview.png';
    } else {
      this.likeBtn = '../../assets/heart-removebg-preview.png';
    }
  }

  async getPostById() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.id,
      },
    };
    var response = this.service.sendRequest('getpostbyid', data);
    var isSuccess = await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.success
    );

    if (isSuccess) {
      return await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.response
      );
    } else {
      this.router.navigate(['']);
    }
  }
  async onChangeLikeBtn() {
    if (this.likeBtn === '../../assets/heart-removebg-preview.png') {
      this.likeCount++;
      this.likeBtn = '../../assets/heart__1_-removebg-preview.png';
    } else {
      this.likeCount--;
      this.likeBtn = '../../assets/heart-removebg-preview.png';
    }
    this.toggleLike();
  }
  async toggleLike() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        postId: this.id,
        userId: this.user.id,
      },
    };
    var response = this.service.sendRequest('togglelike', data);
    this.setLoading(response);
  }
  async getPictureById(picId: any) {
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
  async getInforUser() {
    this.user = await this.getUserByEmail();

    if (this.user.avatar === '' || this.user.username === '') {
      this.position = 'top';
      this.displayPosition = true;
    }
  }
  async getUserByEmail() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        email: this.vigenereCipherService.vigenereCipher(
          this.cookieService.get('auth-token'),
          '24DJBWID328FNSU32Z',
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
  onClickDialog() {
    this.displayPosition = false;
    this.router.navigate(['/settings']);
  }
  async getUserById(id: number) {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: id,
      },
    };
    var response = this.service.sendRequest('getuserbyid', data);
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
  async onComment() {
    this.clicked = true;
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        postId: this.id,
        userId: this.user.id,
        comment: this.formComment.get('content').value,
      },
    };
    var response = this.service.sendRequest('addcomment', data);
    this.setLoading(response);
    console.log('res', response);
    if (
      (await response.then(
        (__zone_symbol__value) => __zone_symbol__value.body.success
      )) === true
    ) {
      this.messageService.add({
        key: 'smsg',
        severity: 'success',
        summary: 'Message',
        detail: 'Your comment was updated successfully',
      });
    } else {
      this.messageService.add({
        key: 'smsg',
        severity: 'error',
        summary: 'Message',
        detail: 'Your comment was updated unsuccessfully',
      });
    }
  }
  async getCommentByPostId() {
    var data = {
      'secret-key': 'd7sTPQBxmSv8OmHdgjS5',
      body: {
        id: this.id,
      },
    };
    var response = this.service.sendRequest('getcommentsbypostid', data);
    this.setLoading(response);
    console.log('res', response);
    return await response.then(
      (__zone_symbol__value) => __zone_symbol__value.body.response
    );
  }
  async getListOwnerComment(listComment) {
    var listUser = [];
    for (var comment in listComment) {
      var request = this.getUserById(listComment[comment].userId);
      listUser.push(await request);
    }

    return listUser;
  }
}
