import { SearchEntry } from 'src/types'

export const getBookmarks = async () => {
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
  return flatTree
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
