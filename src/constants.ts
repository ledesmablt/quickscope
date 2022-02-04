export const IS_DEV = process.env.NODE_ENV !== 'production'

// TODO: make this more robust
export const FILTER_LIST_OPTIONS = ['my list', 'bookmarks', 'tabs']
export const FILTER_LIST_PERMISSION_MAP: Record<string, string[]> = {
  bookmarks: ['bookmarks'],
  tabs: ['tabs', 'windows']
}

export const FILTER_LIST_DEFAULT_CHECKED = ['my list']
