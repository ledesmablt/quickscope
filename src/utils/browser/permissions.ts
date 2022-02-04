import _ from 'lodash'

const getAll = async (): Promise<string[]> => {
  return new Promise((resolve) =>
    chrome.permissions.getAll(({ permissions }) => {
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

const request = async (permission: string | string[]): Promise<boolean> => {
  return new Promise((resolve) =>
    chrome.permissions.request(
      {
        permissions: typeof permission === 'string' ? [permission] : permission
      },
      (granted) => {
        resolve(granted)
      }
    )
  )
}

export default {
  getAll,
  contains,
  request
}
