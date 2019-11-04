import { UrlService } from '../src/UrlService';
import { MockService } from '../src/MockService';

/*export interface AjaxRequest {
  url?: string;
  body?: any;
  user?: string;
  async?: boolean;
  method?: string;
  headers?: Object;
  timeout?: number;
  password?: string;
  hasContent?: boolean;
  crossDomain?: boolean;
  withCredentials?: boolean;
  createXHR?: () => XMLHttpRequest;
  progressSubscriber?: Subscriber<any>;
  responseType?: string;
}*/

export interface AjaxError extends Error {
  status: number;
}

export type Options = {
  host?: string;
  headers?: HeadersInit;
  responseType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
  enabledMock?: boolean;
};

export class HttpService {
  private static defaultOptions: Options = {
    responseType: 'json',
    enabledMock: process.env.NODE_ENV === 'test',
  };
  private urlService = new UrlService();
  private mockService = new MockService();

  public mock = {
    get: this.mockService.get.bind(this.mockService),
  };

  constructor(private readonly options: Options = {}) {
    this.options = { ...HttpService.defaultOptions, ...this.options };
  }

  public get<R = unknown>(url: string, options?: Options): Promise<R> {
    const mergedOptions = { ...this.options, ...options };
    let endpoint: string = '';

    if (mergedOptions.host !== undefined) {
      endpoint = this.urlService.parse(mergedOptions.host, url);
    }

    if (mergedOptions.enabledMock) {
      return this.mockService.from('get', url);
    }

    return fetch(endpoint, { headers: mergedOptions.headers }).then(
      response => {
        if (!response.ok) {
          throw {
            status: response.status,
            message: response.statusText,
            name: 'Ajax Error',
          } as AjaxError;
        }

        return response[mergedOptions.responseType!]();
      }
    );
  }
}
