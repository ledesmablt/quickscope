import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import YamlEditor from '../components/YamlEditor'
import FilterOptions from '../components/FilterOptions'
import ExternalRequestsConfig from '../components/ExternalRequestsConfig'
import { exportMyListCsv, exportSettingsJson } from 'src/utils/export'
import { importMyListCsv, importSettingsJson } from 'src/utils/import'
import useStore from 'src/utils/useStore'

const Settings = (): ReactElement => {
  const { myList: myListTextCached } = useStore()
  const setMyListTextCached = (value: string) => {
    useStore.setState({
      myList: value
    })
  }
  const [myListText, setMyListText] = useState(myListTextCached || '')

  useEffect(() => {
    // override on state changes
    if (myListTextCached) {
      setMyListText(myListTextCached)
    }
  }, [myListTextCached])

  return (
    <div className='full'>
      <p>settings</p>

      <div className='p-2' />
      <FilterOptions />

      <div className='p-4' />
      <p>
        <b>my list</b>
      </p>
      <YamlEditor
        value={myListText}
        onChange={setMyListText}
        onSave={setMyListTextCached}
        onImport={importMyListCsv}
        onExport={exportMyListCsv}
      />

      <div className='p-4' />
      <p>
        <b>external requests</b>
      </p>
      <ExternalRequestsConfig />

      <div className='p-4' />
      <p>
        <b>other settings</b>
      </p>
      <div className='flex gap-2 pt-2'>
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
          onChange={importSettingsJson}
        />
        <button onClick={() => exportSettingsJson()}>export settings</button>
      </div>
    </div>
  )
}
export default Settings
