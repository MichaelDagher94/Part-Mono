export class LoginResponse {
    isSuccess: boolean;
    errorMessage: string;
    errorCode: number;
    data: {
        numParticipant: string;
        token: string;
        refreshToken: string;
    };

    constructor(
        isSuccess: boolean,
        errorMessage: string,
        errorCode: number,
        numParticipant: string,
        token: string,
        refreshToken: string
    ) {
        this.isSuccess = isSuccess;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.data = {
            numParticipant,
            token,
            refreshToken
        };
    }
}