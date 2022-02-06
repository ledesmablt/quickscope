import { SearchItem } from 'src/types'
import permissions from 'src/utils/browser/permissions'
import storage from 'src/utils/browser/storage'

interface Bookmark extends chrome.bookmarks.BookmarkTreeNode {
  tags?: string[]
}

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
  const recurseTree = (tree: Bookmark): Bookmark[] => {
    if (tree.children) {
      let tags = tree.tags || []
      if (tree.title) {
        tags = [...tags, tree.title]
      }
      return tree.children.flatMap((tree) => {
        return recurseTree({
          ...tree,
          tags
        })
      })
    }
    return [tree]
  }
  const flatTree = tree.flatMap(recurseTree)

  return flatTree.filter((b) => b?.url).map(formatBookmark)
}

export const formatBookmark = (bookmark: Bookmark): SearchItem => {
  return {
    url: bookmark.url,
    title: bookmark.title,
    label: 'bookmarks',
    tags: bookmark.tags?.length ? bookmark.tags : []
  }
}
