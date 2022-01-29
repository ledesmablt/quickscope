import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'

const NewTab = (): ReactElement => {
  return <div>hello world</div>
}

const mountNode = document.getElementById('newTab')
ReactDOM.render(<NewTab />, mountNode)
