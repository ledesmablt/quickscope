import React, { ReactElement, useEffect, useState } from 'react'
import _ from 'lodash'
import storage from 'src/utils/storage'
import YamlEditor from '../components/YamlEditor'
import FilterOptions from '../components/FilterOptions'
import ExternalRequestsConfig from '../components/ExternalRequestsConfig'
import { exportSettingsJson } from 'src/utils/export'
import { importSettingsJson } from 'src/utils/import'

const Settings = (): ReactElement => {
  // not using useStateCached since should be valid before saving
  const [myListText, setMyListText] = useState('')

  useEffect(() => {
    storage.get('myList').then((data) => {
      setMyListText(data)
    })
  }, [])

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
        onSave={(myListData) => {
          storage.set({ myList: myListData })
        }}
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
          onChange={(e) => importSettingsJson(e)}
        />
        <button onClick={() => exportSettingsJson()}>export settings</button>
      </div>
    </div>
  )
}
export default Settings
