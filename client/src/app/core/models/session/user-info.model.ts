export const ROLE_USER = 'USER';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_USER_ADMIN = 'USER_ADMIN';

export class UserInfo {
    id: number;
    username: string;
    email: string;
    roles: Set<string>;
    fromValues(values: UserInfo) {
        return Object.assign(this, values);
    }
}
