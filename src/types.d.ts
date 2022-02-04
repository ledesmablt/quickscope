export interface SearchItem {
  url: string
  title?: string
  description?: string
  icon?: string
  label?: string
  tags?: string[]
  priority?: number

  // runtime only
  __tabId?: number
  __windowId?: number
}
