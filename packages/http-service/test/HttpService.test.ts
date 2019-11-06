import { HttpService, Options } from '../src/HttpService';
import { AjaxError } from '../src/AjaxError';

const MOCK_RESPONSE_DATA = { users: [] };

describe('should call api for data with global options', function() {
  afterEach(jest.clearAllMocks);

  // @ts-ignore
  const fetchSpy = jest.spyOn(global, 'fetch');

  const globalOptions: Options = {
    host: 'http://localhost:4000/api',
    headers: { Authorization: 'token' },
    enabledMock: false,
  };

  const httpService = new HttpService(globalOptions);

  it('get method', () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    const getSpy = jest.spyOn(httpService, 'get');

    const result = httpService.get('/users');

    expect(result).toBeInstanceOf(Promise);
    expect(getSpy).toHaveBeenCalledWith('/users');
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: globalOptions.headers,
    });
  });

  it('post method', async function() {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify({ user: { id: 1 } }));

    const BODY = { user: { id: 1 } };

    const postSpy = jest.spyOn(httpService, 'post');

    const result = await httpService.post('/users', BODY);

    expect(postSpy).toHaveBeenCalledWith('/users', BODY);
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: { Authorization: 'token' },
      body: JSON.stringify(BODY),
      method: 'post',
    });
    expect(result).toEqual(BODY);
  });
});

describe('should call api for data with overrides options', function() {
  afterEach(jest.clearAllMocks);

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

  it('get method', () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    const getSpy = jest.spyOn(httpService, 'get');

    httpService.get('/users', localOptions);

    expect(getSpy).toHaveBeenCalledWith('/users', localOptions);
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:5000/api/users', {
      headers: localOptions.headers,
    });
  });

  it('post method', function() {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify({ user: { id: 1 } }));

    const postSpy = jest.spyOn(httpService, 'post');

    httpService.post('/users', {}, localOptions);
    expect(postSpy).toHaveBeenCalledWith('/users', {}, localOptions);
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:5000/api/users', {
      headers: localOptions.headers,
      body: JSON.stringify({}),
      method: 'post',
    });
  });
});

describe('should call api and return parsed json', function() {
  afterEach(jest.clearAllMocks);

  // @ts-ignore
  const fetchSpy = jest.spyOn(global, 'fetch');

  const globalOptions: Options = {
    host: 'http://localhost:4000/api',
    headers: { Authorization: 'token' },
    enabledMock: false,
  };

  const httpService = new HttpService(globalOptions);

  it('get method', async () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    const result = await httpService.get('/users');

    expect(result).toEqual(MOCK_RESPONSE_DATA);
  });

  it('post method', async function() {
    const POST_RESPONSE = { user: { id: 1 } };
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(POST_RESPONSE));

    const result = await httpService.post('/users', {});

    expect(result).toEqual(POST_RESPONSE);
  });
});

describe('should call api and return text', function() {
  afterEach(jest.clearAllMocks);

  // @ts-ignore
  const fetchSpy = jest.spyOn(global, 'fetch');

  const globalOptions: Options = {
    host: 'http://localhost:4000/api',
    headers: { Authorization: 'token' },
    responseType: 'text',
    enabledMock: false,
  };

  const httpService = new HttpService(globalOptions);

  it('get method', async () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(MOCK_RESPONSE_DATA));

    const result = await httpService.get('/users');

    expect(result).toEqual(JSON.stringify(MOCK_RESPONSE_DATA));
  });

  it('post method', async function() {
    const POST_RESPONSE = { user: { id: 1 } };
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(POST_RESPONSE));

    const result = await httpService.post('/users', {});

    expect(result).toEqual(JSON.stringify(POST_RESPONSE));
  });
});

describe('should return error', function() {
  afterEach(jest.clearAllMocks);

  const ajaxError: AjaxError<{ message: string }> = {
    name: 'Ajax Error',
    message: 'Internal Server Error',
    status: 500,
    response: { message: 'Internal Server Error' },
  };

  const globalOptions: Options = {
    host: 'http://localhost:4000/api',
    headers: { Authorization: 'token' },
    enabledMock: false,
  };

  const httpService = new HttpService(globalOptions);

  it('get method', () => {
    // @ts-ignore
    fetch.mockReject(ajaxError);

    expect(httpService.get('/users')).rejects.toEqual(ajaxError);
  });

  it('post method', function() {
    // @ts-ignore
    fetch.mockReject(ajaxError);

    expect(httpService.post('/users', {})).rejects.toEqual(ajaxError);
  });
});

describe('should mock api call', function() {
  afterEach(jest.clearAllMocks);

  const globalOptions: Options = {
    host: 'http://localhost:4000/api',
    headers: { Authorization: 'token' },
  };

  const httpService = new HttpService(globalOptions);

  it('get method', async () => {
    // mock request without jest-mock!
    const spyMockGet = jest.spyOn(httpService.mock, 'get');

    const MOCKED_RESPONSE = { users: [] };

    const clear = httpService.mock.get('/users', MOCKED_RESPONSE);

    const RESPONSE = await httpService.get('/users');

    expect(spyMockGet).toHaveBeenCalledWith('/users', MOCKED_RESPONSE);
    expect(RESPONSE).toEqual(MOCKED_RESPONSE);

    clear();
  });

  it('post method', async function() {
    // mock request without jest-mock!
    const spyMockPost = jest.spyOn(httpService.mock, 'post');

    const MOCKED_RESPONSE = { users: [] };

    const clear = httpService.mock.post('/users', MOCKED_RESPONSE);

    const RESPONSE = await httpService.post('/users', {});

    expect(spyMockPost).toHaveBeenCalledWith('/users', MOCKED_RESPONSE);
    expect(RESPONSE).toEqual(MOCKED_RESPONSE);

    clear();
  });
});

describe('should mock failed api call', function() {
  afterEach(jest.clearAllMocks);

  const globalOptions: Options = {
    host: 'http://localhost:4000/api',
    headers: { Authorization: 'token' },
  };

  const httpService = new HttpService(globalOptions);

  const ERROR: AjaxError = {
    status: 500,
    name: 'Ajax Error',
    message: 'Internal Server Error',
    response: { message: 'Internal Server Error' },
  };

  it('get method ', async () => {
    // mock request without jest-mock!
    httpService.mock.get('/users', ERROR);

    try {
      await httpService.get('/users');
    } catch (e) {
      expect(e).toEqual(ERROR);
    }
  });

  it('post method', async function() {
    // mock request without jest-mock!
    httpService.mock.post('/users', ERROR);

    try {
      await httpService.get('/users');
    } catch (e) {
      expect(e).toEqual(ERROR);
    }
  });
});

describe('should map request before send and then eject interceptor', function() {
  afterEach(jest.clearAllMocks);

  it('get method', function() {
    // @ts-ignore
    fetch.mockResponse(JSON.stringify(MOCK_RESPONSE_DATA));

    const httpService = new HttpService({
      host: 'http://localhost:4000/api/',
      headers: { Authorization: 'token' },
      enabledMock: false,
      reqInterceptor: req => {
        return { ...req, headers: { Authorization: 'specialToken' } };
      },
    });

    // @ts-ignore
    const fetchSpy = jest.spyOn(global, 'fetch');

    httpService.get('/users');

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: { Authorization: 'specialToken' },
    });

    // eject interceptor
    httpService.get('/users', { reqInterceptor: undefined });

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: { Authorization: 'token' },
    });
  });

  it('post method', function() {
    // @ts-ignore
    fetch.mockResponse(JSON.stringify(MOCK_RESPONSE_DATA));

    const httpService = new HttpService({
      host: 'http://localhost:4000/api/',
      headers: { Authorization: 'token' },
      enabledMock: false,
      reqInterceptor: req => {
        return { ...req, headers: { Authorization: 'specialToken' } };
      },
    });

    // @ts-ignore
    const fetchSpy = jest.spyOn(global, 'fetch');

    httpService.post('/users', {});

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: { Authorization: 'specialToken' },
      body: JSON.stringify({}),
      method: "post"
    });

    // eject interceptor
    httpService.post('/users', {}, { reqInterceptor: undefined });

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:4000/api/users', {
      headers: { Authorization: 'token' },
      body: JSON.stringify({}),
      method: 'post',
    });
  });
});

describe('should map response before .then method and then eject interceptor', function() {
  afterEach(jest.clearAllMocks);

  it('get method', async function() {
    // @ts-ignore
    fetch.mockResponse(JSON.stringify(MOCK_RESPONSE_DATA));

    const httpService = new HttpService({
      host: 'http://localhost:4000/api/',
      headers: { Authorization: 'token' },
      enabledMock: false,
      resInterceptor: res => {
        return res.then(r => ({ ...r, status: 'active' }));
      },
    });

    const responseOne = await httpService.get('/users');

    expect(responseOne).toEqual({ users: [], status: 'active' });

    // eject interceptor
    const responseTwo = await httpService.get('/users', {
      resInterceptor: undefined,
    });

    expect(responseTwo).toEqual({ users: [] });
  });

  it('post method', async function() {
    // @ts-ignore
    fetch.mockResponse(JSON.stringify(MOCK_RESPONSE_DATA));

    const httpService = new HttpService({
      host: 'http://localhost:4000/api/',
      headers: { Authorization: 'token' },
      enabledMock: false,
      resInterceptor: res => {
        return res.then(r => ({ ...r, status: 'active' }));
      },
    });

    const responseOne = await httpService.post('/users', {});

    expect(responseOne).toEqual({ users: [], status: 'active' });

    // eject interceptor
    const responseTwo = await httpService.post(
      '/users',
      {},
      {
        resInterceptor: undefined,
      }
    );

    expect(responseTwo).toEqual({ users: [] });
  });
});

describe('should map response before .then method and then eject interceptor - with mock', () => {
  afterEach(jest.clearAllMocks);

  it('get method', async function() {
    const httpService = new HttpService({
      host: 'http://localhost:4000/api/',
      headers: { Authorization: 'token' },
      resInterceptor: res => {
        return res.then(r => ({ ...r, status: 'active' }));
      },
    });

    httpService.mock.get('/users', { users: [] });

    const responseOne = await httpService.get('/users');

    expect(responseOne).toEqual({ users: [], status: 'active' });

    // eject interceptor
    const responseTwo = await httpService.get('/users', {
      resInterceptor: undefined,
    });

    expect(responseTwo).toEqual({ users: [] });
  });

  it('post method', async function() {
    const httpService = new HttpService({
      host: 'http://localhost:4000/api/',
      headers: { Authorization: 'token' },
      resInterceptor: res => {
        return res.then(r => ({ ...r, status: 'active' }));
      },
    });

    httpService.mock.post('/users', { users: [] });

    const responseOne = await httpService.post('/users', {});

    expect(responseOne).toEqual({ users: [], status: 'active' });

    // eject interceptor
    const responseTwo = await httpService.post(
      '/users',
      {},
      {
        resInterceptor: undefined,
      }
    );

    expect(responseTwo).toEqual({ users: [] });
  });
});
