// src/types/axios.types.ts
import type { 
    InternalAxiosRequestConfig,
    AxiosHeaders,
    Method,
    ResponseType,
    AxiosResponseHeaders
  } from 'axios';
  
  // Definição do tipo AxiosRequestConfig compatível com Axios v1.x
  export interface AxiosRequestConfig {
    url?: string;
    method?: Method | string;
    baseURL?: string;
    headers?: AxiosHeaders | Record<string, string>;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    decompress?: boolean;
    transitional?: {
      silentJSONParsing?: boolean;
      forcedJSONParsing?: boolean;
      clarifyTimeoutError?: boolean;
    };
  }