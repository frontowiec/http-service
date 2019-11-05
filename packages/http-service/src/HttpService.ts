import { UrlService } from './UrlService';
import { MockService } from './MockService';
import { AjaxError } from './AjaxError';

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

export interface Request {
  host?: string;
  headers?: HeadersInit;
  responseType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
}

export interface Options extends Request {
  enabledMock?: boolean;
  mockDelay?: number;
  reqInterceptor?: (req: ReqInterceptor) => ReqInterceptor;
  resInterceptor?: <T = unknown>(res: Promise<T>) => Promise<T>;
}

export interface ReqInterceptor extends Options {
  url?: string;
}

type Mock = {
  get: <R>(url: string, response: R) => Function;
};

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

  public mock: Mock = {
    get: this.mockService.get.bind(this.mockService),
  };

  constructor(private readonly options: Options = {}) {
    this.options = { ...HttpService.defaultOptions, ...this.options };
  }

  public get<R = unknown>(url: string, options?: Options): Promise<R> {
    const mergedOptions = { ...this.options, ...options };

    // secure correct endpoint
    let endpoint: string = '';

    if (mergedOptions.host !== undefined) {
      endpoint = this.urlService.parse(mergedOptions.host, url);
    }

    // build request options
    let mappedOptions = mergedOptions;

    if (mergedOptions.reqInterceptor !== undefined) {
      mappedOptions = mergedOptions.reqInterceptor({
        ...mergedOptions,
        url: endpoint,
      });
    }

    // return mock in test env
    if (mappedOptions.enabledMock) {
      if (mappedOptions.resInterceptor) {
        return mappedOptions.resInterceptor(this.mockService.from('get', url));
      }
      return this.mockService.from('get', url);
    }

    return fetch(endpoint, { headers: mappedOptions.headers }).then(
      response => {
        let mappedResponse = response[mappedOptions.responseType!]();

        if (mappedOptions.resInterceptor) {
          mappedResponse = mappedOptions.resInterceptor(mappedResponse);
        }

        if (!response.ok) {
          throw {
            status: response.status,
            message: response.statusText,
            name: 'Ajax Error',
            response: mappedResponse,
          } as AjaxError;
        }

        return mappedResponse;
      }
    );
  }
}
