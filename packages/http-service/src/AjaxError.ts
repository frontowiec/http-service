export interface AjaxError<R = unknown> extends Error {
  status: number;
  response: R;
}
