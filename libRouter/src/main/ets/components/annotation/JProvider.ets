export function JProvider(params: JProviderParams) {
  return Object;
}

export interface JProviderParams {
  path: string,
  singleton: boolean
}