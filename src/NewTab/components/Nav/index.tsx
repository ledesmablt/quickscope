import React, { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Nav = (): ReactElement => {
  const { pathname } = useLocation()
  return (
    <div className='flex self-end gap-4'>
      {pathname !== '/' ? (
        <Link className='hover:underline ' to='/' tabIndex={-1}>
          go back
        </Link>
      ) : (
        <Link className='hover:underline' to='/settings' tabIndex={-1}>
          settings
        </Link>
      )}
      <a
        className='hover:underline '
        href='https://ledesmablt.notion.site/quickscope-4bf6ef806e314db5b52d11c8afb0471c'
        target='_blank'
        tabIndex={-1}
      >
        help
      </a>
    </div>
  )
}
export default Nav
