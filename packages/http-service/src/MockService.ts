type Methods = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class MockService {
  private getRepository = new Map<string, unknown>();
  private postRepository = new Map<string, unknown>();

  public from<R = unknown>(method: Methods, url: string): Promise<R> {
    const repository = this.getRepositoryByMethodType(method);
    const result = repository.get(url);

    if (result === undefined) {
      throw new Error(
        `Method: ${method.toUpperCase()}, URL: ${url} is not set yet`
      );
    }

    return new Promise<R>(resolve => resolve(result as R));
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
