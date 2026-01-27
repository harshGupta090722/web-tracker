"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image';

function Dashboard() {
  const [websiteList, setWebsiteList] = useState([]);
  return (
    <div className='mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-xl'>My Website</h2>
        <Button>+ website</Button>
      </div>

      {/*Empty State*/}
      <div>
        {websiteList?.length == 0 ?
          <div className='flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed rounded-2xl mt-5'>
            <Image src={'/website.png'} alt='website' width={100} height={100}></Image>
            <h2>You don't have any website as of now !</h2>
            <Button>+ website</Button>
          </div> :
          <div>
            {/*Website List*/}
          </div>
        }
      </div>
    </div>
  )
}

export default Dashboard