import React, { ReactElement, useEffect } from 'react'
import ReactDOM from '@hot-loader/react-dom'
import { Route, MemoryRouter, Routes } from 'react-router-dom'

import '../styles.css'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Nav from './components/Nav'
import useStore, { defaults as storeDefaults } from 'src/utils/hooks/useStore'
import _ from 'lodash'
import storage from 'src/utils/browser/storage'

const NewTab = (): ReactElement => {
  const store = useStore()
  useEffect(() => {
    store.init().then(async () => {
      const localStorageKeys = Object.keys(storeDefaults)
      useStore.subscribe(async (newState, oldState) => {
        // keep store & local storage in sync
        const changes = _.pickBy(newState, (v, k) => {
          if (!localStorageKeys.includes(k)) {
            return
          }
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

  useEffect(() => {
    if (!store.initialized) {
      return
    }
    const query = document.getElementsByTagName('html')
    const html: HTMLHtmlElement = query?.[0]
    if (store.isDarkMode) {
      html.setAttribute('class', 'dark')
    } else {
      html.removeAttribute('class')
    }
  }, [store.initialized, store.isDarkMode])

  return (
    <MemoryRouter>
      <div className='text-xs min-w-screen min-h-screen px-8 py-4 flex flex-col justify-center items-center text-gray-900'>
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
