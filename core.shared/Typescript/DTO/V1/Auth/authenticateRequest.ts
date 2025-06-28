/* Auto Generated */

export interface AuthenticateRequest {
    login: string;
    hashedPassword: string;
    oldHashedPassword: string;
    password: string;
    deviceName: string;
    ipAddress: string;
    deviceId: string;
    attempt: number;
    isSiteWeb: boolean;
    platform: string;
    browser: string;
    engine: string;
}
