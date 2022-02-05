import _ from 'lodash'
import { browser } from 'src/constants'

const getAll = async (): Promise<string[]> => {
  return new Promise((resolve) =>
    browser.permissions.getAll(({ permissions }) => {
      resolve(permissions)
    })
  )
}

const contains = async (permission: string | string[]): Promise<boolean> => {
  const allPermissions = await getAll()
  const permissions = typeof permission === 'string' ? [permission] : permission
  const common = _.intersection(allPermissions, permissions)
  return common.length === permissions.length
}

// must be synchronous to work in firefox
const request = (
  permission: string | string[],
  callback: (granted: boolean) => void
): void => {
  browser.permissions.request(
    {
      permissions: typeof permission === 'string' ? [permission] : permission
    },
    callback
  )
}

export default {
  getAll,
  contains,
  request
}
