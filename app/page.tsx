import LeftSidebar from '@/components/LeftSidebar'
import { Button } from '@/components/ui/button'
import React from 'react'

const Home = () => {
  return (
    <div className='mt-9 flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <LeftSidebar/>
        <h1 className='text-20 font-bold text-white-1'>Trending Podcasts</h1>
      </section>
    </div>
  )
}

export default Home