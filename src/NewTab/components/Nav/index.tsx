import React, { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Nav = (): ReactElement => {
  const { pathname } = useLocation()
  return (
    <div className='flex self-end hover:underline'>
      {pathname !== '/' ? (
        <Link to='/' tabIndex={-1}>
          go back
        </Link>
      ) : (
        <Link to='/settings' tabIndex={-1}>
          settings
        </Link>
      )}
    </div>
  )
}
export default Nav
