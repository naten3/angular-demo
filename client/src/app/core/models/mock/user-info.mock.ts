import { Chance } from 'chance';
import { UserInfo, ROLE_ADMIN, ROLE_USER_ADMIN, ROLE_USER } from 'app/core/models/session';

const chance = new Chance();
export const getUserInfoMock = (): UserInfo => {
  return {
    id: chance.natural(),
    username: chance.string(),
    firstName: chance.string(),
    lastName: chance.string(),
    email: chance.email(),
    profileImage: chance.url(),
    socialProfileImage: chance.url(),
    socialUser: chance.bool(),
    emailVerified: chance.bool(),
    accountLocked: chance.bool(),
    roles: chance.pickset([ROLE_ADMIN, ROLE_USER_ADMIN, ROLE_USER])
  };
};
