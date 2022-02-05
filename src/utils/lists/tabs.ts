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
  // tab groups not available in firefox
  const tabGroups = await browser.tabGroups?.query({})
  return tabs
    .filter((tab) => tab.id !== currentTab?.id)
    .map((tab) => {
      const tabGroup = tabGroups?.find(
        (g) => tab.groupId && g.id === tab.groupId
      )
      return {
        ...formatTab(tab),
        tags: tabGroup?.title ? [tabGroup.title] : null
      }
    })
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
