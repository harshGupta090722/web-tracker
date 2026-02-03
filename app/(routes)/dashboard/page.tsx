"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { WebsiteInfoType, WebsiteType } from '@/configs/type';
import WebsiteCard from './_components/WebsiteCard';
import { Skeleton } from '@/components/ui/skeleton';

function Dashboard() {
  const [websiteList, setWebsiteList] = useState<WebsiteInfoType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetUserWebsites();
  }, [])


  const GetUserWebsites = async () => {
    setLoading(true);
    const result = await axios.get('/api/website');
    setWebsiteList(result?.data);
    console.log("I am inside (routes)>dashboard>", result.data);
    setLoading(false);
  }

  return (
    <div className='mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-xl'>My Website</h2>
        <Link href={'/dashboard/new'}>
          <Button>+ website</Button>
        </Link>
      </div>

      {/*Empty State*/}
      <div>
        {loading && <div className='grid grid-cols-1 md:grid-col-2 xl:grid-cols-4 gap-5'>
          {[1, 2, 3, 4].map((item, index) => {
            return <div className='p-4' key={index}>
              <div className='flex gap-2 items-center'>
                <Skeleton className='h-8 w-8 rounded-sm'></Skeleton>
                <Skeleton className='h-8 w-1/2 rounded-sm'></Skeleton>
              </div>
              <Skeleton className='h-20 w-full mt-4 '></Skeleton>
            </div>
          })}
        </div>}

        {!loading && websiteList?.length == 0 ?
          <div className='flex flex-col justify-center items-center gap-4 p-8 border-2 border-dashed rounded-2xl mt-5'>
            <Image src={'/website.png'} alt='website' width={100} height={100}></Image>
            <h2>You don't have any website as of now !</h2>
            <Link href={'/dashboard/new'}>
              <Button>+ website</Button>
            </Link>
          </div> :
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 xl:grid-cols-3 mt-5'>
            {/*Website List*/}
            {websiteList?.map((website, index) => {
              return <WebsiteCard key={index} websiteInfo={website} />
            })}
          </div>
        }
      </div>
    </div>
  )
}

export default Dashboard