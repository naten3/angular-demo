
export interface State {
    success: boolean;
    submitted: boolean;
    pendingUpdate: boolean;
    errors?: Array<string>;
}

export const initialState = {
    success: false,
    submitted: false,
    pendingUpdate: false,
    errors: []
};

