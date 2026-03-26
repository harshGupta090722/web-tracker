import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function PricingPage() {
    return (
        <div className='mt-7'>
            <h2 className='text-3xl font-bold mt-5'>Pricing</h2>
            <h2 className='mb-5 text-sm text-gray-500'>Choose the perfect plan for your needs</h2>
            <PricingTable />
        </div>
    )
}

export default PricingPage