export const IS_DEV = process.env.NODE_ENV !== 'production'
export const BROWSER_ENV = process.env.BROWSER || 'chrome'

export const FILTER_LIST_OPTIONS = ['my list', 'bookmarks', 'tabs']
export const FILTER_LIST_PERMISSION_MAP: Record<string, string[]> = {
  bookmarks: ['bookmarks'],
  tabs: BROWSER_ENV === 'chrome' ? ['tabs', 'windows'] : ['tabs']
}

export const FILTER_LIST_DEFAULT_CHECKED = ['my list']

export const browser = window?.browser || chrome
