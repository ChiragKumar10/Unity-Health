export interface EnvironmentConfig {
    baseUrl: string;
    apiUrl: string;
    timeout: number;
    retries: number;
}

const environments: Record<string, EnvironmentConfig> = {
    qa: {
        baseUrl: 'https://qa.unityhealth360.com',
        apiUrl: 'https://qa-api.unityhealth360.com',
        timeout: 30000,
        retries: 2
    }
};

export const getEnvironmentConfig = (): EnvironmentConfig => {
    return environments['qa'];
}; 