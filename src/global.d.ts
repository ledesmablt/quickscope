import * as Logger from './utils/logger'

declare global {
  const logger: typeof Logger
  const browser: typeof chrome
}
