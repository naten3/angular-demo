import { State } from 'app/core/models/admin-user-list';

export const getPageNumber = (state: State) => state.page;
export const getUserPage = (state: State) => state.userPage;
export const getUserInfo = (id: number) => (state: State) => (!!state.userPage ? state.userPage.content.find(ui => ui.id === id) : null);
export const getManagedUser = (state: State) => state.currentlyManagedUser;
export const getManagedUserError = (state: State) => state.fetchManagedUserFailure;
export const getDeletedUsers = (state: State) => state.deletedUsers;
