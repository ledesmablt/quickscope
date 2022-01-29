import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'

import '../styles.css'
import Search from './Search'

const NewTab = (): ReactElement => {
  return (
    <div className='w-screen h-screen'>
      <div className='w-full h-3/4 min-h-[30rem] flex flex-col justify-center items-center'>
        <Search />
      </div>
    </div>
  )
}

const mountNode = document.getElementById('newTab')
ReactDOM.render(<NewTab />, mountNode)
