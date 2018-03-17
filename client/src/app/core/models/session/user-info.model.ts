export const ROLE_USER = 'USER';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_USER_ADMIN = 'USER_ADMIN';

export class UserInfo {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    socialProfileImage?: string;
    roles: Set<string>;
    fromValues(values: UserInfo) {
        return Object.assign(this, values);
    }
}
