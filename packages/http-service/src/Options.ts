export interface Request {
  host?: string;
  headers?: HeadersInit;
  responseType?: 'json' | 'text' | 'arrayBuffer' | 'blob' | 'formData';
}

export interface Options extends Request {
  enabledMock?: boolean;
  mockDelay?: number;
  reqInterceptor?: (req: ReqInterceptor) => ReqInterceptor;
  resInterceptor?: <T = unknown>(res: Promise<T>) => Promise<T>;
}

export interface ReqInterceptor extends Options {
  url?: string;
}
