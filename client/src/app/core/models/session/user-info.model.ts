export interface UserInfo {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  socialProfileImage?: string;
  socialUser: boolean;
  emailVerified: boolean;
  accountLocked: boolean;
  roles: Array<string>;
}
