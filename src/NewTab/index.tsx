import React, { ReactElement, useEffect } from 'react'
import ReactDOM from '@hot-loader/react-dom'
import { Route, MemoryRouter, Routes } from 'react-router-dom'

import '../styles.css'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Nav from './components/Nav'
import useStore from 'src/utils/useStore'
import _ from 'lodash'
import storage from 'src/utils/storage'

const NewTab = (): ReactElement => {
  const store = useStore()
  useEffect(() => {
    store.init().then(async () => {
      useStore.subscribe(async (newState, oldState) => {
        // keep store & local storage in sync
        const changes = _.pickBy(newState, (v, k) => {
          return !_.isEqual(v, oldState?.[k])
        })
        if (changes && Object.keys(changes).length) {
          await storage.set(changes)
        }
      })
    })
    return () => {
      useStore.destroy()
    }
  }, [])

  return (
    <MemoryRouter>
      <div className='min-w-screen min-h-screen px-8 py-4 flex flex-col justify-center items-center text-gray-900'>
        <Nav />
        <div className='pt-8' />
        <div className='w-1/2 min-w-[24rem] max-w-[40rem] flex flex-col items-center grow'>
          <Routes>
            <Route path='/settings' element={<Settings />} />
            <Route path='/' element={<Home />} />
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  )
}

const mountNode = document.getElementById('newTab')
ReactDOM.render(<NewTab />, mountNode)
