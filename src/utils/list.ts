import { SearchEntry } from 'src/types'

export const TEST_LIST = [
  'go',
  'javascript',
  'python',
  'rust',
  'swift',
  'kotlin',
  'elixir',
  'java',
  'lisp',
  'v',
  'zig',
  'nim',
  'rescript',
  'd',
  'haskell'
]

export const buildSearchList = (): SearchEntry[] => {
  // todo: build from different sources
  return TEST_LIST.map((v) => ({
    url: v,
    title: v
  }))
}
