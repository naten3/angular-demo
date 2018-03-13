

import { createSelector } from 'reselect';
import { State } from 'app/core/models/app.state';
import * as fromTodo from 'app/core/models/todo';
import * as fromTree from 'app/core/models/tree';
import * as fromSession from 'app/core/models/session';
import * as fromSave from 'app/core/models/common/save.state';

export const getAppState = (state: State) => state;

export const getSaveState = (state: State) => state.save;
export const getSaveStateLoading = createSelector(getSaveState, fromSave.getLoading);

export const getTodosState = (state: State) => state.todos;
export const getAllTodos = createSelector(getTodosState, fromTodo.getTodos);

export const getTreeState = (state: State) => state.tree;
export const getAllNodes = createSelector(getTreeState, fromTree.getNodes);

export const getSessionState = (state: State) => state.session;
export const getSession = createSelector(getSessionState, fromSession.identity);
export const getUserInfo = createSelector(getSessionState, fromSession.getUserInfo);
export const getPendingSessionUpdate = createSelector(getSessionState, fromSession.getPendingUpdate);
export const getHasFetchedSessionStatus = createSelector(getSessionState, fromSession.getHasFetchedStatus);
