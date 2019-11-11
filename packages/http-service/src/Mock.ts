export type Mock = {
  get: <R>(url: string, response: R) => Function;
  post: <R>(url: string, response: R) => Function;
};
