import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'
import { Route, MemoryRouter, Routes } from 'react-router-dom'

import '../styles.css'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Nav from './components/Nav'

const NewTab = (): ReactElement => {
  return (
    <MemoryRouter>
      <div className='w-screen h-screen px-8 py-4 flex flex-col justify-center items-center'>
        <Nav />
        <div className='w-1/2 min-w-[24rem] max-w-[40rem] h-full min-h-[30rem] flex flex-col items-center pt-20'>
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
