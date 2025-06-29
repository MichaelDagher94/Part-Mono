export class LoginRequest {
    login: string;
    password: string;
    deviceName: string;
    ipAddress: string;
    deviceId: string;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;

    constructor(
    ) {
        this.login = '';
        this.password = '';
        this.deviceName = '';
        this.ipAddress = '';
        this.deviceId = '';
        this.isSiteWeb = true;
        this.platform = '';
        this.browser = '';
        this.engine = '';
    }
}