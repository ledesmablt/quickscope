import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'

import '../styles.css'

const NewTab = (): ReactElement => {
  return (
    <div className='container max-w-full w-full h-screen flex justify-center items-center'>
      <p className='text-3xl'>hello world</p>
    </div>
  )
}

const mountNode = document.getElementById('newTab')
ReactDOM.render(<NewTab />, mountNode)
