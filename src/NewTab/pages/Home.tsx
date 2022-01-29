import React, { ReactElement } from 'react'
import Search from '../components/Search'

const Home = (): ReactElement => {
  return (
    <div className='w-full h-full'>
      <p className='pb-2'>quickscope</p>
      <div className='full max-h-[40rem]'>
        <Search />
      </div>
      <div className='pb-8' />
    </div>
  )
}
export default Home
