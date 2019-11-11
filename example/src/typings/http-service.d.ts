import { HttpServiceImpl, Options, Mock } from "http-service";

declare module "http-service" {
  export declare class HttpService {
    private service;
    private readonly options;
    private static defaultOptions;
    private urlService;
    private mockService;
    mock: Mock;
    constructor(service: HttpServiceImpl, options?: Options);
    get<R = unknown>(url: string, options?: Options): Promise<R>;
    post<R = unknown, B = unknown>(
      url: string,
      body: B,
      options?: Options
    ): Promise<R>;
  }
}
