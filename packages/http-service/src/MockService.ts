type Methods = 'get' | 'post' | 'put' | 'patch' | 'delete';

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

    return new Promise<R>(resolve =>
      setTimeout(() => resolve(result as R), this.options.delay)
    );
  }

  public get<R>(url: string, response: R): void {
    if (this.getRepository.get(url)) {
      throw new Error(`Method: GET, URL: ${url} is already defined`);
    }

    this.getRepository.set(url, response);
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
