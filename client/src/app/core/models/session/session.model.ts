export class SessionInfo {
    name: string;
    roomId: number;
    fromValues(values: SessionInfo) {
        return Object.assign(this, values);
    }
}
