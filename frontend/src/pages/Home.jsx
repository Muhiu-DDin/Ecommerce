import BestSeller from '@/components/BestSeller'
import Hero from '@/components/Hero'
import LatestCollection from '@/components/LatestCollection'
import NewsLetteraBox from '@/components/NewsLetteraBox'
import Policy from '@/components/Policy'
import React from 'react'

function Home() {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <Policy/>
      <NewsLetteraBox/>
    </div>
  )
}

export default Home
