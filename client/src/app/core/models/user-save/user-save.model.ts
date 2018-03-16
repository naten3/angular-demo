export class UserSaveRequest {
  public email: string;
  public username: string;
  public password: string;

  fromValues(values: UserSaveRequest) {
    return Object.assign(this, values);
  }
}
