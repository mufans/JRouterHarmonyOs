export function JRouterInterceptor(params:JRouterInterceptorParams) {
  return Object
}

export interface JRouterInterceptorParams {
  path: string,
  global?: boolean,
  priority?: number
}