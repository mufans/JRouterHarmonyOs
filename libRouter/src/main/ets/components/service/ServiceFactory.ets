export interface ServiceFactory {
  create(): object

  destroy(): void
}