import { UrlService } from './UrlService';
import { Options } from './Options';
import { HttpServiceImpl } from './HttpServiceImpl';
import { Mock } from './Mock';

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

// todo: TypeError: Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
// todo: extract generic parts

export class HttpService {
  private static defaultOptions: Options = {
    responseType: 'json',
    enabledMock: process.env.NODE_ENV === 'test',
    mockDelay: 0,
  };
  private urlService = new UrlService();
  private mockService = this.service.createMock({
    delay: this.options.mockDelay,
  });

  public mock: Mock = {
    get: this.mockService.get.bind(this.mockService),
    post: this.mockService.post.bind(this.mockService),
  };

  constructor(
    private service: HttpServiceImpl,
    private readonly options: Options = {}
  ) {
    this.options = { ...HttpService.defaultOptions, ...this.options };
  }

  public get(url: string, options?: Options) {
    const mergedOptions = { ...this.options, ...options };

    // secure correct endpoint
    let endpoint: string = this.urlService.parse(mergedOptions.host, url);

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

    return this.service.get(endpoint, mappedOptions);
  }

  public post(url: string, body: any, options?: Options) {
    const mergedOptions = { ...this.options, ...options };
    // secure correct endpoint
    let endpoint: string = this.urlService.parse(mergedOptions.host, url);

    // build request options
    let mappedOptions = mergedOptions;

    if (mergedOptions.reqInterceptor !== undefined) {
      mappedOptions = mergedOptions.reqInterceptor({
        ...mergedOptions,
        url: endpoint,
      });
    }

    if (mappedOptions.enabledMock) {
      if (mappedOptions.resInterceptor) {
        return mappedOptions.resInterceptor(this.mockService.from('post', url));
      }
      return this.mockService.from('post', url);
    }

    return this.service.post(endpoint, body, mappedOptions);
  }
}
