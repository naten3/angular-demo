export interface State {
    success: boolean;
    submitted: boolean;
    pendingUpdate: boolean;
    errors?: Array<string>;

    passwordSuccess: boolean;
    passwordSubmitted: boolean;
    passwordPendingUpdate: boolean;
    passwordErrors?: Array<string>;
}

export const initialState = {
    success: false,
    submitted: false,
    pendingUpdate: false,
    errors: [],

    passwordSuccess: false,
    passwordSubmitted: false,
    passwordPendingUpdate: false,
    passwordErrors: []
};

