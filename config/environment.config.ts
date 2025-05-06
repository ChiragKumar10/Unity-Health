export interface EnvironmentConfig {
    adminPortalUrl: string;
    providerPortalUrl: string;
    apiUrl: string;
    timeout: number;
    retries: number;
}

const environments: Record<string, EnvironmentConfig> = {
    qa: {
        adminPortalUrl: 'https://qa.unityhealth360.com/auth/login',
        providerPortalUrl: 'https://automation.qa.unityhealth360.com/auth/login',
        apiUrl: 'https://qa-api.unityhealth360.com',
        timeout: 30000,
        retries: 2
    }
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
    return environments['qa'];
}; 