export const log = (payload: any) => {
  chrome.runtime.sendMessage({
    text: 'LOG_INFO',
    payload
  })
}
export const error = (payload: any) => {
  chrome.runtime.sendMessage({
    text: 'LOG_ERROR',
    payload
  })
}
