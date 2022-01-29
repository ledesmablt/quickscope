import { SearchEntry } from 'src/types'

export const searchBookmarks = async (searchText: string) => {
  const result = await chrome.bookmarks.search(searchText)
  return result
}

export const formatBookmark = (
  bookmark: chrome.bookmarks.BookmarkTreeNode
): SearchEntry => {
  return {
    url: bookmark.url,
    title: bookmark.title,
    label: 'bookmark'
  }
}
