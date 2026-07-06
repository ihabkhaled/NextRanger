import type { AxiosRequestConfig, AxiosResponse } from 'axios';

/** App-owned aliases so consumers never name the vendor types directly. */
export type HttpRequestConfig = AxiosRequestConfig;
export type HttpResponse<TData> = AxiosResponse<TData>;
