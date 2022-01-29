import React, { ReactElement } from 'react'
import Search from '../components/Search'

const Home = (): ReactElement => {
  return (
    <>
      <div className='h-3/4 min-h-[20rem] max-h-[40rem] w-1/2 min-w-[24rem] max-w-[40rem]'>
        <Search />
      </div>
      <div className='pb-8' />
    </>
  )
}
export default Home
