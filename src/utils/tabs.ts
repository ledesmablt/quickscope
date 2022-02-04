import { SearchItem } from 'src/types'
import permissions from './permissions'
import storage from './storage'

export const getTabs = async () => {
  const included = (await storage.get('filterOptions_includeLists'))?.includes(
    'tabs'
  )
  if (!included) {
    return []
  }
  const hasPermission = await permissions.contains('tabs')
  if (!hasPermission) {
    return []
  }
  const currentTab = await chrome.tabs.getCurrent()
  const tabs = await chrome.tabs.query({})
  return tabs.filter((tab) => tab.id !== currentTab.id).map(formatTab)
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
