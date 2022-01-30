import { SearchEntry } from 'src/types'
import storage from './storage'

export const getBookmarks = async () => {
  const excluded = (await storage.get('options.filter.excludeList'))?.bookmarks
  if (excluded) {
    return []
  }
  const tree = await chrome.bookmarks.getTree()
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
): SearchEntry => {
  return {
    url: bookmark.url,
    title: bookmark.title,
    label: 'bookmarks'
  }
}
