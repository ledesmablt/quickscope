import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import YamlEditor from '../components/YamlEditor'
import FilterOptions from '../components/FilterOptions'
import ExternalRequestsConfig from '../components/ExternalRequestsConfig'
import { exportMyListCsv, exportSettingsJson } from 'src/utils/export'
import { importMyListCsv, importSettingsJson } from 'src/utils/import'
import useStore from 'src/utils/hooks/useStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

const Settings = (): ReactElement => {
  const myListTextCached = useStore((store) => store.myList) || ''
  const setMyListTextCached = (value: string) => {
    useStore.setState({
      myList: value
    })
  }
  const [myListText, setMyListText] = useState(myListTextCached || '')
  useEffect(() => {
    if (myListTextCached) {
      setMyListText(myListTextCached)
    }
  }, [myListTextCached])

  const searchDebounceCached = useStore((store) => store.searchDebounce) || 150
  const setSearchDebounceCached = (value: string) => {
    const newDebounce = parseFloat(value)
    if (newDebounce > 0) {
      useStore.setState({
        searchDebounce: _.round(newDebounce, 0)
      })
    }
  }
  const [searchDebounceText = '', setSearchDebounceText] = useState(
    searchDebounceCached?.toFixed(0)
  )
  useEffect(() => {
    if (searchDebounceCached) {
      setSearchDebounceText(searchDebounceCached?.toFixed(0))
    }
  }, [searchDebounceCached])
  const searchDebounceError =
    !searchDebounceText || !(parseFloat(searchDebounceText) > 0)

  return (
    <div className='full'>
      <p>settings</p>

      <div className='p-2' />
      <FilterOptions />

      <div className='p-4' />
      <p>
        <b>my list</b>
        <a
          className='ml-2'
          href='https://ledesmablt.notion.site/quickscope-4bf6ef806e314db5b52d11c8afb0471c#a184b66196c94e8e899c5e4e24497187'
          target='_blank'
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </a>
      </p>
      <YamlEditor
        value={myListText}
        onChange={setMyListText}
        onSave={setMyListTextCached}
        onImport={(e) => importMyListCsv(e, setMyListTextCached)}
        onExport={exportMyListCsv}
      />

      <div className='p-4' />
      <p>
        <b>external requests</b>
        <a
          className='ml-2'
          href='https://ledesmablt.notion.site/quickscope-4bf6ef806e314db5b52d11c8afb0471c#a184b66196c94e8e899c5e4e24497187'
          target='_blank'
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </a>
      </p>
      <ExternalRequestsConfig />

      <div className='p-4' />
      <p>
        <b>other settings</b>
      </p>

      <div className='flex flex-col pt-2'>
        <label htmlFor='search-debounce'>search debounce (ms)</label>
        <input
          className='w-32'
          type='text'
          id='search-debounce'
          placeholder='default: 150'
          value={searchDebounceText}
          onChange={(e) => {
            setSearchDebounceText(e.target.value)
            setSearchDebounceCached(e.target.value)
          }}
        />
      </div>
      {searchDebounceError && (
        <p className={'error'}>value must be a positive integer</p>
      )}

      <div className='flex gap-2 pt-4'>
        <button>
          <label className='cursor-pointer' htmlFor='import-settings'>
            import settings
          </label>
        </button>
        <input
          className='hidden'
          id='import-settings'
          type='file'
          accept='application/JSON'
          onChange={(e) => importSettingsJson(e, useStore.setState)}
        />
        <button onClick={() => exportSettingsJson()}>export settings</button>
      </div>
    </div>
  )
}
export default Settings
