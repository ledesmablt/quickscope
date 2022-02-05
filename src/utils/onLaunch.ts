import { browser } from 'src/constants'
import { SearchItem } from 'src/types'

interface Options {
  newTab?: boolean
}
export default async (searchItem: SearchItem, options?: Options) => {
  if (options?.newTab) {
    // open in new tab
    window.open(searchItem.url, '_blank')
  } else if (searchItem.__tabId) {
    // focus browser tab
    const [currentTab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    })
    browser.tabs.update(searchItem.__tabId, { active: true })
    // not available in firefox
    browser.windows?.update(searchItem.__windowId, { focused: true })
    currentTab && browser.tabs.remove(currentTab.id)
  } else {
    // open in same window
    window.open(searchItem.url, '_self')
  }
}
