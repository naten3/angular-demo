export interface State {
  success: boolean;
  submitted: boolean;
  pendingUpdate: boolean;
  errors?: Array<string>;

  passwordSuccess: boolean;
  passwordSubmitted: boolean;
  passwordPendingUpdate: boolean;
  passwordErrors?: Array<string>;

  deleteSuccess: boolean;
  deleteSubmitted: boolean;
  deletePendingUpdate: boolean;
  deleteErrors?: Array<string>;

  unlockPendingUpdateId: boolean;
}

export const initialState: State = {
  success: false,
  submitted: false,
  pendingUpdate: false,
  errors: [],

  passwordSuccess: false,
  passwordSubmitted: false,
  passwordPendingUpdate: false,
  passwordErrors: [],

  deleteSuccess: false,
  deleteSubmitted: false,
  deletePendingUpdate: false,
  deleteErrors: [],

  unlockPendingUpdateId: false
};
