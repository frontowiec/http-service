import { HttpService } from '../src/HttpService';
import { HttpServiceImpl } from '../src/HttpServiceImpl';
import { Options } from '../src/Options';
import { MockOptions } from '../src/MockOptions';
import { MockServiceImpl } from '../src/MockServiceImpl';

class MockImpl implements MockServiceImpl {
  from(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string) {
    method;
    url;
  }

  get(url: string, response: any): Function {
    url;
    response;
    return () => {};
  }

  post(url: string, response: any): Function {
    url;
    response;
    return () => {};
  }
}

class ServiceImpl implements HttpServiceImpl {
  get(url: string, options?: Options) {
    return { url, options };
  }

  post(url: string, body: any, options?: Options) {
    return { url, body, options };
  }

  createMock(options: MockOptions) {
    options;
    return new MockImpl();
  }
}

describe('Http service', function() {
  afterEach(jest.clearAllMocks);

  const serviceImpl = new ServiceImpl();

  it('should merged passed global options with default and call methods', function() {
    const options: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      enabledMock: false,
    };
    const httpService = new HttpService(serviceImpl, options);
    const getSpy = jest.spyOn(serviceImpl, 'get');
    const postSpy = jest.spyOn(serviceImpl, 'post');

    httpService.get('/users');
    httpService.post('/users', { user: { id: 1 } });

    const optionsWithDefaults: Options = {
      ...options,
      mockDelay: 0,
      responseType: 'json',
    };

    expect(getSpy).toHaveBeenCalledWith(
      'http://localhost:4000/api/users',
      optionsWithDefaults
    );
    expect(postSpy).toHaveBeenCalledWith(
      'http://localhost:4000/api/users',
      { user: { id: 1 } },
      optionsWithDefaults
    );
  });

  it('should override global options with local and merged with default options', function() {
    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      enabledMock: false,
    };
    const localOptions: Options = {
      host: 'http://localhost:5000/api',
      headers: { Authorization: 'special-fake-token' },
    };
    const httpService = new HttpService(serviceImpl, globalOptions);
    const getSpy = jest.spyOn(serviceImpl, 'get');
    const postSpy = jest.spyOn(serviceImpl, 'post');

    httpService.get('/users', localOptions);
    httpService.post('/users', { user: { id: 1 } }, localOptions);

    const expectedOptions = {
      ...globalOptions,
      ...localOptions,
      // defaults
      mockDelay: 0,
      responseType: 'json',
    };

    expect(getSpy).toHaveBeenCalledWith(
      'http://localhost:5000/api/users',
      expectedOptions
    );
    expect(postSpy).toHaveBeenCalledWith(
      'http://localhost:5000/api/users',
      { user: { id: 1 } },
      expectedOptions
    );
  });

  it('should call mock impl', function() {
    const httpService = new HttpService(serviceImpl, { enabledMock: true });

    const getSpy = jest.spyOn(serviceImpl, 'get');
    const postSpy = jest.spyOn(serviceImpl, 'post');

    httpService.get('http://localhost:4000/api/users');
    httpService.post('http://localhost:4000/api/users', { user: { id: 1 } });

    // todo: how to check if "from" method was called

    expect(getSpy).not.toHaveBeenCalled();
    expect(postSpy).not.toHaveBeenCalled();
  });

  // todo: req, rest interceptor na potem

  xit('should map request before call serviceImpl method', function() {
    const httpService = new HttpService(serviceImpl, {
      enabledMock: false,
      host: 'http://localhost:4000/api',
      reqInterceptor: req => ({ ...req, url: 'http://localhost:4000/api/v2' }),
    });
    const getSpy = jest.spyOn(serviceImpl, 'get');

    httpService.get('/users');

    expect(getSpy).toHaveBeenCalledWith('http://localhost:4000/api/v2/users');
  });
});
