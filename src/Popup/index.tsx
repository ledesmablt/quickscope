import React, { ReactElement } from 'react'
import ReactDOM from '@hot-loader/react-dom'

const Popup = (): ReactElement => {
  return <div style={{ width: 360, padding: 8 }}>hello world</div>
}

const mountNode = document.getElementById('popup')
ReactDOM.render(<Popup />, mountNode)
