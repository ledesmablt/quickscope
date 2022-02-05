import * as Logger from './utils/logger'

declare global {
  const logger: typeof Logger
  interface Window {
    readonly browser: typeof chrome
  }
}
