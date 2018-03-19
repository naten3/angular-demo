export const ROLE_USER = 'USER';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_USER_ADMIN = 'USER_ADMIN';

export interface UserInfo {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    socialProfileImage?: string;
    socialUser: boolean;
    roles: Set<string>;
}

export const getDisplayProfileImage: (ui: UserInfo) => string = (ui: UserInfo) => 
ui.profileImage || ui.socialProfileImage;
