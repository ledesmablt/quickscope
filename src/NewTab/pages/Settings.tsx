import React, { ReactElement, useEffect, useState } from 'react'
import yaml from 'js-yaml'
import _ from 'lodash'
import storage from 'src/utils/storage'
import YamlEditor from '../components/YamlEditor'

const Settings = (): ReactElement => {
  // TODO: save multiple lists
  const [myListText, setMyListText] = useState('')

  useEffect(() => {
    storage.get('myList').then((data) => {
      setMyListText(yaml.dump(data, { skipInvalid: true }))
    })
  }, [])

  return (
    <div className='full'>
      <p>settings</p>
      <div className='p-2' />
      <p>my list</p>
      <YamlEditor
        value={myListText}
        onChange={setMyListText}
        onSave={(myListData) => {
          storage.set({ myList: myListData })
        }}
      />
    </div>
  )
}
export default Settings
