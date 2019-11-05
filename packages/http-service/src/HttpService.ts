import { UrlService } from './UrlService';
import { MockService } from './MockService';
import {AjaxError} from "./AjaxError";

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

// todo: trochę Ci się mieszają opcje mocka, http-service z ustawieniami requesta
export type Options = {
  host?: string;
  headers?: HeadersInit;
  responseType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
  enabledMock?: boolean;
  mockDelay?: number;
};

// todo: mock http errors
// todo: interceptors
// todo: post method
// todo: extract generic parts

export class HttpService {
  private static defaultOptions: Options = {
    responseType: 'json',
    enabledMock: process.env.NODE_ENV === 'test',
    mockDelay: 0,
  };
  private urlService = new UrlService();
  private mockService = new MockService({
    delay: this.options.mockDelay,
  });

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
            response: response[mergedOptions.responseType!](),
          } as AjaxError;
        }

        return response[mergedOptions.responseType!]();
      }
    );
  }
}
