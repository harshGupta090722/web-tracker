"use client";

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import WebsiteForm from './_components/WebsiteForm'
import ScriptForm from './_components/ScriptForm'

function AddWebsite() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const step = searchParams.get('step');
    const websiteId = searchParams.get('websiteId') ?? '';
    const domain = searchParams.get('domain') ?? '';

    return (
        <div className='flex items-center w-full justify-center mt-10'>
            <div className='max-w-lg flex flex-col items-start w-full'>

                {/* Back to Dashboard */}
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeft />
                    Dashboard
                </Button>

                <div className='mt-10 w-full'>
                    {step === 'script' ? (
                        <ScriptForm websiteId={websiteId} domain={domain} />
                    ) : (
                        <WebsiteForm />
                    )}
                </div>

            </div>
        </div>
    )
}

export default AddWebsite;