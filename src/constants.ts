export const IS_DEV = process.env.NODE_ENV !== 'production'

// TODO: make this more robust
export const FILTER_LIST_OPTIONS = ['my list', 'bookmarks']
export const FILTER_LIST_PERMISSION_MAP = {
  bookmarks: 'bookmarks',
  tabs: 'tabs'
}

export const FILTER_LIST_DEFAULT_CHECKED = ['my list']
