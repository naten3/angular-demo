import { maxBy } from 'lodash';
import { UserInfo } from './';

export const ROLE_USER = 'USER';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_USER_ADMIN = 'USER_ADMIN';

export const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';

export const getDisplayProfileImage: (ui: UserInfo) => string = (ui: UserInfo) => ui.profileImage || ui.socialProfileImage;

export const checkIfUserAdmin: (ui: UserInfo) => boolean = (ui: UserInfo) =>
  !!ui.roles.find(x => x === ROLE_USER_ADMIN || x === ROLE_ADMIN);

export const checkIfAdmin: (ui: UserInfo) => boolean = (ui: UserInfo) => !!ui.roles.find(x => x === ROLE_ADMIN);

export const getRoleValue = (role: string) => {
  if (role === ROLE_USER) {
    return 1;
  } else if (role === ROLE_USER_ADMIN) {
    return 2;
  } else if (role === ROLE_ADMIN) {
    return 3;
  } else {
    return 0;
  }
};

export const highestLevelRole: (ui: UserInfo) => string = (ui: UserInfo) => {
  return maxBy(ui.roles, getRoleValue);
};
