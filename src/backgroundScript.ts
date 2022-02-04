import _ from 'lodash'

chrome.runtime.onMessage.addListener(async (message) => {
  // logging
  if (message?.text === 'LOG_INFO') {
    console.log(message.payload)
  } else if (message?.text === 'LOG_ERROR') {
    console.error(message.payload)
  }
})

chrome.contextMenus.create({
  id: _.uniqueId(),
  title: 'Save to quickscope'
})

chrome.contextMenus.onClicked.addListener((event, tab) => {
  // push tab to my list
  console.log(event)
  console.log(tab)
})
