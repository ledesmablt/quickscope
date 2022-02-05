import { browser } from 'src/constants'
import { SearchItem } from 'src/types'
import permissions from 'src/utils/browser/permissions'
import storage from 'src/utils/browser/storage'

export const getTabs = async () => {
  const included = (await storage.get('includeLists'))?.includes('tabs')
  if (!included) {
    return []
  }
  const hasPermission = await permissions.contains('tabs')
  if (!hasPermission) {
    return []
  }
  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const tabs = await browser.tabs.query({})
  return tabs.filter((tab) => tab.id !== currentTab?.id).map(formatTab)
}

export const formatTab = (tab: chrome.tabs.Tab): SearchItem => {
  return {
    __tabId: tab.id,
    __windowId: tab.windowId,
    url: tab.url,
    description: '(go to tab)',
    label: 'tabs',
    title: tab.title
  }
}
