export class User {
  constructor(
    private readonly token : string,
    private readonly email : string,
    private username : string,
    private avatar : string,
    private status : number
  ) {}
  getToken() {return this.token}
  getEmail() { return this.email; }
  getUsername() { return this.username; }
  getAvatar() { return this.avatar; }
  getStatus() {return this.status;}
  setUsername(username) { this.username = username; }
  setAvatar(avatar) { this.avatar = avatar; }
  setStatus(status) {this.status = status;}

}
