import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'

import '../styles.css'
import Search from './components/Search'

const NewTab = (): ReactElement => {
  return (
    <div className='w-screen h-screen min-w-screen min-h-screen'>
      <div className='w-full h-3/4 min-h-[30rem] flex flex-col justify-center items-center'>
        <div className='h-3/4 min-h-[20rem] max-h-[40rem] w-1/2 min-w-[24rem] max-w-[40rem]'>
          <Search />
        </div>
      </div>
    </div>
  )
}

const mountNode = document.getElementById('newTab')
ReactDOM.render(<NewTab />, mountNode)
