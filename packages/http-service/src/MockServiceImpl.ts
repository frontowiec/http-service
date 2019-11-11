import { Methods } from './Methods';

export interface MockServiceImpl {
  from(method: Methods, url: string): any;
  get(url: string, response: any): Function;
  post(url: string, response: any): Function;
}
