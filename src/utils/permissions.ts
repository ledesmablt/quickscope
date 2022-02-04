export default {
  getAll: async (): Promise<string[]> => {
    return new Promise((resolve) =>
      chrome.permissions.getAll(({ permissions }) => {
        resolve(permissions)
      })
    )
  },
  request: async (permissions: string[]): Promise<boolean> => {
    return new Promise((resolve) =>
      chrome.permissions.request({ permissions }, (granted) => {
        resolve(granted)
      })
    )
  }
}
