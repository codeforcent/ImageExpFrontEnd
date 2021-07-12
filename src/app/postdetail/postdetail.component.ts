import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../app.service';
import { VigenereCipherService } from '../vigenere-cipher.service';

@Component({
  selector: 'app-postdetail',
  templateUrl: './postdetail.component.html',
  styleUrls: ['./postdetail.component.css'],
})
export class PostdetailComponent implements OnInit {
  sub;
  id;
  post;
  likeBtn = '../../assets/heart-removebg-preview.png';
  loading;
  picture;
  user;
  displayPosition;
  position;
  postUser;
  constructor(
    private route: ActivatedRoute,
    private service: AppService,
    private router: Router,
    private cookieService: CookieService,
    private vigenereCipherService: VigenereCipherService
  ) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params['id'];
    });
    if (this.cookieService.check('auth-token')) {
      this.getInforUser();
    } else {
      this.router.navigate(['']);
    }
  }

  async ngOnInit() {
    this.post = await this.getPostById();
    console.log('post', this.post);
    this.picture = await this.getPictureById(this.post.picId);
    console.log(this.picture);
    this.postUser = await this.getUserById(this.post.userId);
    console.log("postUser", this.postUser);
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
  onChangeLikeBtn() {
    if (this.likeBtn === '../../assets/heart-removebg-preview.png') {
      this.likeBtn = '../../assets/heart__1_-removebg-preview.png';
    } else {
      this.likeBtn = '../../assets/heart-removebg-preview.png';
    }
  }
  async getPictureById(picId) {
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
      this.router.navigate(['']);
    }
  }
}
