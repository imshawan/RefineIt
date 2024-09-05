export interface IUserTokenInfo {
    name: string;
    email: string;
    sub: string;
    id: string;
    jwtToken: string;
    iat: number;  // Issued at time (in Unix timestamp)
    exp: number;  // Expiration time (in Unix timestamp)
    jti: string;  // Unique identifier for the token
}

export class UserTokenStore {
    private static userTokenInfo: IUserTokenInfo | null = null;

    public static setTokenInfo(tokenInfo: IUserTokenInfo): void {
        UserTokenStore.userTokenInfo = tokenInfo;
    }

    public static getTokenInfo(): IUserTokenInfo | null {
        return UserTokenStore.userTokenInfo;
    }

    public static getJwtToken(): string | null {
        return UserTokenStore.userTokenInfo ? UserTokenStore.userTokenInfo.jwtToken : null;
    }

    public static clearTokenInfo(): void {
        UserTokenStore.userTokenInfo = null;
    }

    public static isTokenExpired(): boolean {
        if (UserTokenStore.userTokenInfo && UserTokenStore.userTokenInfo.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Get current time in Unix timestamp
            return currentTime > UserTokenStore.userTokenInfo.exp;
        }
        return true; // If no token is set, consider it expired
    }
}