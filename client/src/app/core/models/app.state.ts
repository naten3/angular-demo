
import { createSelector } from 'reselect';
import { RouterState } from '@ngrx/router-store';

import * as fromTree from 'app/core/models/tree';
import * as fromTodos from 'app/core/models/todo';
import * as fromSessionState from 'app/core/models/session';
import * as fromUserSave from 'app/core/models/user-save';
import * as fromSave from 'app/core/models/common/save.state';
import * as fromUserUpdate from 'app/core/models/user-update';


export interface State {
    todos: fromTodos.State;
    tree: fromTree.State;
    save: fromSave.State;
    session: fromSessionState.State;
    addUser: fromUserSave.State;
    updateUser: fromUserUpdate.State;
    router: RouterState;
}

export const initialState = {
    todos: fromTodos.initialState,
    tree: fromTree.initialState,
    sessionState: fromSessionState.initialState,
    addUser: fromUserSave.initialState,
    updateUser: fromUserUpdate.initialState,
    save: fromSave.initialState
};

