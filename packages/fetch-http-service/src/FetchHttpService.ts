import {
  AjaxError,
  Options,
  HttpServiceImpl,
  MockServiceImpl,
  MockOptions,
} from 'http-service';
import { PromiseMockService } from './PromiseMockService';

export class FetchHttpService implements HttpServiceImpl {
  public get<R = unknown>(url: string, options: Options): Promise<R> {
    return fetch(url, { headers: options.headers }).then(response => {
      let mappedResponse = response[options.responseType || 'json']();

      if (options.resInterceptor) {
        mappedResponse = options.resInterceptor(mappedResponse);
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
    });
  }

  public post<R = unknown, B = unknown>(
    url: string,
    body: B,
    options: Options
  ): Promise<R> {
    return fetch(url, {
      method: 'post',
      headers: options.headers,
      body: JSON.stringify(body), // todo reqInterceptor doesnt mapped body
    }).then(response => {
      let mappedResponse = response[options.responseType!]();

      if (options.resInterceptor) {
        mappedResponse = options.resInterceptor(mappedResponse);
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
    });
  }

  createMock(options: MockOptions): MockServiceImpl {
    return new PromiseMockService(options);
  }
}
