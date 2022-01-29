import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'
import { Route, MemoryRouter, Routes, Link } from 'react-router-dom'

import '../styles.css'
import Home from './pages/Home'
import Settings from './pages/Settings'

const NewTab = (): ReactElement => {
  return (
    <MemoryRouter>
      <div className='w-screen h-screen min-w-screen min-h-screen px-8 py-4'>
        <div className='flex justify-end'>
          <Link to='/settings' tabIndex={-1}>
            settings
          </Link>
        </div>
        <div className='w-full h-3/4 min-h-[30rem] flex flex-col justify-center items-center'>
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
