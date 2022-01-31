import storage from './storage'

export const downloadText = (data: string, filename: string): void => {
  const element = document.createElement('a')
  try {
    const file = new Blob([data])
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
  } catch (err) {
    throw err
  } finally {
    element.remove()
  }
}

export const exportSettingsJson = async () => {
  const allSettings = await storage.get()
  downloadText(JSON.stringify(allSettings, null, 2), 'quickscope_settings.json')
}
