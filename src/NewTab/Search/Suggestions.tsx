import { Fzf } from 'fzf'
import React, { ReactElement, useMemo } from 'react'
import { buildSearchList } from 'src/utils/list'

interface Props {
  searchText: string
}
const Suggestions = ({ searchText }: Props): ReactElement => {
  const fzf = useMemo(() => {
    const list = buildSearchList()
    return new Fzf(list, {
      selector: (v) => {
        return v.url + v.title
      }
    })
  }, [])

  const results = searchText ? fzf.find(searchText) : []

  return (
    <div className='flex-grow border p-2 text-gray-400'>
      <ul>
        {results.map((result) => {
          return (
            <li>
              <p>{result.item.title || result.item.url}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default Suggestions
