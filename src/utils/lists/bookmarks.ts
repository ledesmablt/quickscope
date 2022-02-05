import { browser } from 'src/constants'
import { SearchItem } from 'src/types'
import permissions from 'src/utils/browser/permissions'
import storage from 'src/utils/browser/storage'

export const getBookmarks = async () => {
  const included = (await storage.get('includeLists'))?.includes('bookmarks')
  if (!included) {
    return []
  }
  const hasPermission = await permissions.contains('bookmarks')
  if (!hasPermission) {
    return []
  }
  const tree = (await browser.bookmarks.getTree()) || []
  const recurseTree = (
    tree: chrome.bookmarks.BookmarkTreeNode
  ): chrome.bookmarks.BookmarkTreeNode[] => {
    if (tree.children) {
      return tree.children.flatMap(recurseTree)
    }
    return [tree]
  }
  const flatTree = tree.flatMap(recurseTree)

  return flatTree.filter((b) => b?.url).map(formatBookmark)
}

export const formatBookmark = (
  bookmark: chrome.bookmarks.BookmarkTreeNode
): SearchItem => {
  return {
    url: bookmark.url,
    title: bookmark.title,
    label: 'bookmarks'
  }
}
