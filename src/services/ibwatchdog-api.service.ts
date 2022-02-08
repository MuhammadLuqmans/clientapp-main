import axios, { AxiosInstance } from "axios";
import { AccountsClient, AuthorizationClient, ContainersManagementClient, OrdersClient, QuotesClient, SymbolClient, TradesClient, UsersClient } from "../swagger-clients/ibwatchdog-api-clients.service";


const getAxiosInstance = (token?: string): AxiosInstance => {
    const AxiosInstance = axios.create();
    // Add a request interceptor
    if (token) {
        AxiosInstance.interceptors.request.use(async function (config) {
            if (token) {
                const authorization = `Bearer ${token}`;
                config.headers.Authorization = authorization;
            }
            return config;
        });
    }
    return AxiosInstance;
};

const ibWatchdogServiceUrl = process.env.REACT_APP_BACKEND_API_ENDPOINT;

export const getTradesClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new TradesClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getAccountsClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new AccountsClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getOrdersClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new OrdersClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getContainersManagementClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new ContainersManagementClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getAuthorizationClient = () => {
    const AxiosInstance = getAxiosInstance();
    return new AuthorizationClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getUsersClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new UsersClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getSymbolClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new SymbolClient(ibWatchdogServiceUrl, AxiosInstance);
};

export const getQuotesClient = (token: string) => {
    const AxiosInstance = getAxiosInstance(token);
    return new QuotesClient(ibWatchdogServiceUrl, AxiosInstance);
};