import { MockService } from '../src/MockService';
import { AjaxError } from '../src/AjaxError';

describe('Mock service', () => {
  afterEach(jest.clearAllMocks)

  it('should set and return mocked data for http get method', async () => {
    const mockService = new MockService();
    const spyFrom = jest.spyOn(mockService, 'from');
    const spyGet = jest.spyOn(mockService, 'get');

    const RESPONSE = { users: [] };

    mockService.get('/users', RESPONSE);

    const results = await mockService.from('get', '/users');

    expect(spyGet).toHaveBeenCalledWith('/users', RESPONSE);
    expect(spyFrom).toHaveBeenCalledWith('get', '/users');
    expect(results).toEqual(RESPONSE);
  });

  it('should set and return error object for failed http get method', async function() {
    const mockService = new MockService();

    const ERROR = {
      name: 'Ajax error',
      status: 500,
      message: 'Internal Server Error',
      response: { message: 'Internal Server Error' },
    };

    mockService.get<AjaxError>('/users', ERROR);

    try {
      await mockService.from('get', '/users');
    } catch (e) {
      expect(e).toEqual(ERROR);
    }
  });

  it('should throw exception when called mock not exist yet', function() {
    const mockService = new MockService();

    // no previously set mock

    expect(() => mockService.from('get', '/users')).toThrowError(
      'Method: GET, URL: /users is not set yet'
    );
  });

  it('should throw exception when try save same url two times', function() {
    const mockService = new MockService();

    mockService.get('/users', {});

    expect(() => mockService.get('/users', {})).toThrowError(
      'Method: GET, URL: /users is already defined'
    );
  });

  it('should return mocked response with delay', async function() {
    const DELAY = 100;
    const RESPONSE = { users: [] };
    const mockService = new MockService({ delay: DELAY });

    mockService.get('/users', RESPONSE);

    const results = await mockService.from('get', '/users');

    expect(results).toEqual(RESPONSE);
  });
});
