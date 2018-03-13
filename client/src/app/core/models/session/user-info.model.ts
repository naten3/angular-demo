export class UserInfo {
    id: number;
    username: string;
    email: string;
    roles: Set<string>;
    fromValues(values: UserInfo) {
        return Object.assign(this, values);
    }
}
