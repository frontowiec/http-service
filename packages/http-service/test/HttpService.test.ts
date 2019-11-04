import { AjaxError, HttpService, Options } from '../src/HttpService';

const MOCK_RESPONSE_DATA = { users: [] };

describe('Http service', () => {
  it('should call api for data with global options', () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    // @ts-ignore
    const fetchSpy = jest.spyOn(global, 'fetch');

    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      enabledMock: false,
    };

    const httpService = new HttpService(globalOptions);

    const getSpy = jest.spyOn(httpService, 'get');

    const result = httpService.get('/users');

    expect(result).toBeInstanceOf(Promise);
    expect(getSpy).toHaveBeenCalledWith('/users');
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: globalOptions.headers,
    });
  });

  it('should call api for data with overrides options', () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    // @ts-ignore
    const fetchSpy = jest.spyOn(global, 'fetch');

    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      enabledMock: false,
    };

    const localOptions: Options = {
      host: 'http://localhost:5000/api',
      headers: { 'response-type': 'text' },
      enabledMock: false,
    };

    const httpService = new HttpService(globalOptions);

    const getSpy = jest.spyOn(httpService, 'get');

    httpService.get('/users', localOptions);

    expect(getSpy).toHaveBeenCalledWith('/users', localOptions);
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:5000/api/users', {
      headers: localOptions.headers,
    });
  });

  it('should call api and return parsed json', async () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    // @ts-ignore
    const fetchSpy = jest.spyOn(global, 'fetch');

    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      enabledMock: false,
    };

    const httpService = new HttpService(globalOptions);

    const result = await httpService.get('/users');

    expect(result).toEqual(MOCK_RESPONSE_DATA);
  });

  it('should call api and return text', async () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    // @ts-ignore
    const fetchSpy = jest.spyOn(global, 'fetch');

    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      responseType: 'text',
      enabledMock: false,
    };

    const httpService = new HttpService(globalOptions);

    const result = await httpService.get('/users');

    expect(result).toEqual(JSON.stringify(MOCK_RESPONSE_DATA));
  });

  it('should return error', async () => {
    const ajaxError: AjaxError = {
      name: 'Ajax Error',
      message: 'Internal Server Error',
      status: 500,
    };
    // @ts-ignore
    fetch.mockReject(ajaxError);

    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
      enabledMock: false,
    };

    const httpService = new HttpService(globalOptions);

    try {
      await httpService.get('/users');
    } catch (e) {
      expect(e).toEqual(ajaxError);
    }
  });

  it('should mock function in test env', async () => {
    // mock request without jest-mock!
    const globalOptions: Options = {
      host: 'http://localhost:4000/api',
      headers: { Authorization: 'token' },
    };

    const httpService = new HttpService(globalOptions);

    const spyMockGet = jest.spyOn(httpService.mock, 'get');

    const MOCKED_RESPONSE = { users: [] };

    httpService.mock.get('/users', MOCKED_RESPONSE);

    const RESPONSE = await httpService.get('/users');

    expect(spyMockGet).toHaveBeenCalledWith('/users', MOCKED_RESPONSE);
    expect(RESPONSE).toEqual(MOCKED_RESPONSE);
  });
});
