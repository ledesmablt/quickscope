import { SearchItem } from 'src/types'
import storage from './storage'

export const getBookmarks = async () => {
  const included = (await storage.get('filterOptions_includeLists'))?.includes(
    'bookmarks'
  )
  if (!included) {
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
): SearchItem => {
  return {
    url: bookmark.url,
    title: bookmark.title,
    label: 'bookmarks'
  }
}
