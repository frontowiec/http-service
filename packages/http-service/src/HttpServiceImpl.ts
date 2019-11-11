import { Options } from './Options';
import { MockOptions } from './MockOptions';
import { MockServiceImpl } from './MockServiceImpl';

export interface HttpServiceImpl {
  get(url: string, options?: Options): any;
  post(url: string, body: any, options?: Options): any;
  createMock(options: MockOptions): MockServiceImpl;
}
