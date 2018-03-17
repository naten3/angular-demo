export class UserSaveRequest {
  public email: string;
  public username: string;
  public password: string;
  public firstName: string;
  public lastName: string;

  fromValues(values: UserSaveRequest) {
    return Object.assign(this, values);
  }
}
