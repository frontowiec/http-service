import { MockService } from '../src/MockService';

describe('Mock service', () => {
  it('should set and return mocked data for http get method', async () => {
    const mockService = new MockService();
    const spyForm = jest.spyOn(mockService, 'from');
    const spyGet = jest.spyOn(mockService, 'get');

    const RESPONSE = { users: [] };

    mockService.get('/users', RESPONSE);

    const results = await mockService.from('get', '/users');

    expect(spyGet).toHaveBeenCalledWith('/users', RESPONSE);
    expect(spyForm).toHaveBeenCalledWith('get', '/users');
    expect(results).toEqual(RESPONSE);
  });

  it('should throw exception when called mock not exist yet', function() {
    const mockService = new MockService();

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
});
