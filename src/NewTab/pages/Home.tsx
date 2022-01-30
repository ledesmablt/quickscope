import React, { ReactElement } from 'react'
import Search from '../components/Search'

const Home = (): ReactElement => {
  return (
    <div className='grow flex flex-col w-full max-h-[20rem] tall:max-h-[min(80vh,40rem)]'>
      <p className='pb-2'>quickscope</p>
      <Search />
      <div className='pb-4 tall:pb-8' />
    </div>
  )
}
export default Home
