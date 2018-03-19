import { State } from 'app/core/models/admin-user-list';
import { UserInfo } from 'app/core/models/session';
import { where } from 'lodash';

export const getPageNumber = (state: State) => state.page;
export const getUserPage = (state: State) => state.userPage;
export const getUserInfo = (id: number) => (state: State) => state.userPage ?
state.userPage.content.find(ui => ui.id === id) : null;
