import { AjaxError } from './AjaxError';
import { Methods } from './Methods';

type MockOptions = {
  delay?: number;
};

export class MockService {
  private static defaultOptions: MockOptions = { delay: 0 };
  private getRepository = new Map<string, unknown>();
  private postRepository = new Map<string, unknown>();

  constructor(private readonly options: MockOptions = {}) {
    this.options = { ...MockService.defaultOptions, ...this.options };
  }

  public from<R = unknown>(method: Methods, url: string): Promise<R> {
    const repository = this.getRepositoryByMethodType(method);
    const result = repository.get(url);

    if (result === undefined) {
      throw new Error(
        `Method: ${method.toUpperCase()}, URL: ${url} is not set yet`
      );
    }

    return new Promise<R>((resolve, reject) =>
      setTimeout(() => {
        const error = result as AjaxError;

        if (!!error.status) {
          reject(result);
          return;
        }
        resolve(result as R);
      }, this.options.delay)
    );
  }

  public clear(method: Methods, url: string) {
    const repository = this.getRepositoryByMethodType(method);
    repository.delete(url);
  }

  public get<R>(url: string, response: R): Function {
    if (this.getRepository.get(url)) {
      throw new Error(`Method: GET, URL: ${url} is already defined`);
    }

    this.getRepository.set(url, response);

    return () => this.clear('get', url);
  }

  public post<R>(url: string, response: R): Function {
    if (this.postRepository.get(url)) {
      throw new Error(`Method: POST, URL: ${url} is already defined`);
    }

    this.postRepository.set(url, response);

    return () => this.clear('post', url);
  }

  private getRepositoryByMethodType(method: Methods) {
    switch (method) {
      case 'get':
        return this.getRepository;
      case 'post':
        return this.postRepository;
      default:
        throw Error(`Repository for ${method} not exist`);
    }
  }
}
