import storage from './storage'

export const fileUploadToString = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<string> => {
  e.preventDefault()
  return new Promise((resolve, reject) => {
    try {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (event) => {
        try {
          resolve(event.target.result?.toString())
        } catch (err) {
          reject(err)
        }
      }
    } catch (err) {
      reject(err)
    } finally {
      // clear file list
      e.target.value = ''
    }
  })
}

export const importSettingsJson = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const string = await fileUploadToString(e)
  const res = JSON.parse(string)
  const approved = confirm(
    'Confirm import settings? This will override all your existing settings.'
  )
  if (!approved) {
    return
  }
  await storage.clear()
  storage.set(res)
  alert('Settings imported. Please refresh the page for changes to reflect.')
}
