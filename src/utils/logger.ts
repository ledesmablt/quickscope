export const log = (payload: any) => {
  console.log(payload)
  chrome.runtime.sendMessage({
    text: 'LOG_INFO',
    payload
  })
}
export const error = (payload: any) => {
  console.error(payload)
  chrome.runtime.sendMessage({
    text: 'LOG_ERROR',
    payload
  })
}
