import { UrlService } from '../src/UrlService';

it('should parse host and url with no slash to valid format', function() {
  const urlService = new UrlService();

  const host = 'http://localhost:4000';
  const url = 'users';
  const results = urlService.parse(host, url);

  expect(results).toBe('http://localhost:4000/users');
});

it('should parse host and url with slash to valid format 1', function() {
  const urlService = new UrlService();

  const host = 'http://localhost:4000/';
  const url = 'users';
  const results = urlService.parse(host, url);

  expect(results).toBe('http://localhost:4000/users');
});

it('should parse host and url with no slash to valid format 2', function() {
  const urlService = new UrlService();

  const host = 'http://localhost:4000';
  const url = '/users';
  const results = urlService.parse(host, url);

  expect(results).toBe('http://localhost:4000/users');
});

it('should parse host and url with no slash to valid format 3', function() {
  const urlService = new UrlService();

  const host = 'http://localhost:4000/';
  const url = '/users';
  const results = urlService.parse(host, url);

  expect(results).toBe('http://localhost:4000/users');
});
