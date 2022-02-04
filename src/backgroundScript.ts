import _ from 'lodash'
import { addToMyList } from './utils/lists/myList'

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
chrome.contextMenus.onClicked.addListener(async (_event, tab) => {
  await addToMyList({
    url: tab.url,
    title: tab.title
  })
})
