"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-separator'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import React, { useState } from 'react'
import { Globe, Loader2Icon, Plus } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from "next/navigation";

function WebsiteForm() {

    const [domain, setDomain] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [enableLocalhostTracking, setEnableLocalhostTracking] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFormSubmit = async (e: any) => {
        e.preventDefault();
        console.log(domain, timeZone, enableLocalhostTracking);
        setLoading(true);

        const websiteId = crypto.randomUUID();
        console.log("website Id", websiteId);

        const result = await axios.post('/api/website', {
            websiteId: websiteId,
            domain: domain,
            timeZone: timeZone,
            enableLocalhostTracking: enableLocalhostTracking
        })

        console.log(result.data);

        if (result.data.data) {
            console.log("we have received message+data from api");
            router.push('/dashboard/new?step=script&websiteId=' + result?.data?.data?.websiteId + '&domain=' + result?.data?.data?.domain);
        } else if (!result?.data?.message) {
            console.log("we have received data from api");
            router.push('/dashboard/new?step=script&websiteId=' + websiteId + '&domain=' + domain);
        } else {
            console.log("This particular domain doesn't belongs to you !");
            alert(result?.data?.message);
        }

        setLoading(false);
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add a new Website</CardTitle>
                </CardHeader>
                <Separator />

                <CardContent>
                    <form className='' onSubmit={(e) => onFormSubmit(e)}>
                        <label className='text-sm'>Domain</label>
                        <InputGroup>
                            <InputGroupInput
                                type='text'
                                placeholder="mywebsite.com" required
                                onChange={(e) => setDomain('https://' + e.target.value)}
                            />
                            <InputGroupAddon>
                                <Globe />
                                <span> https://</span>
                            </InputGroupAddon>
                        </InputGroup>
                        <div className='mt-3'>
                            <label className='text-sm'>Timezone</label>
                            <Select required onValueChange={(value) => setTimeZone(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>North America</SelectLabel>
                                        <SelectItem value="est">Eastern Standard Time</SelectItem>
                                        <SelectItem value="cst">Central Standard Time</SelectItem>
                                        <SelectItem value="mst">Mountain Standard Time</SelectItem>
                                        <SelectItem value="pst">Pacific Standard Time</SelectItem>
                                        <SelectItem value="akst">Alaska Standard Time</SelectItem>
                                        <SelectItem value="hst">Hawaii Standard Time</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Europe & Africa</SelectLabel>
                                        <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
                                        <SelectItem value="cet">Central European Time</SelectItem>
                                        <SelectItem value="eet">Eastern European Time</SelectItem>
                                        <SelectItem value="west">Western European Summer Time</SelectItem>
                                        <SelectItem value="cat">Central Africa Time</SelectItem>
                                        <SelectItem value="eat">East Africa Time</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Asia</SelectLabel>
                                        <SelectItem value="msk">Moscow Time</SelectItem>
                                        <SelectItem value="ist">India Standard Time</SelectItem>
                                        <SelectItem value="cst_china">China Standard Time</SelectItem>
                                        <SelectItem value="jst">Japan Standard Time</SelectItem>
                                        <SelectItem value="kst">Korea Standard Time</SelectItem>
                                        <SelectItem value="ist_indonesia">
                                            Indonesia Central Standard Time
                                        </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Australia & Pacific</SelectLabel>
                                        <SelectItem value="awst">Australian Western Standard Time</SelectItem>
                                        <SelectItem value="acst">Australian Central Standard Time</SelectItem>
                                        <SelectItem value="aest">Australian Eastern Standard Time</SelectItem>
                                        <SelectItem value="nzst">New Zealand Standard Time</SelectItem>
                                        <SelectItem value="fjt">Fiji Time</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>South America</SelectLabel>
                                        <SelectItem value="art">Argentina Time</SelectItem>
                                        <SelectItem value="bot">Bolivia Time</SelectItem>
                                        <SelectItem value="brt">Brasilia Time</SelectItem>
                                        <SelectItem value="clt">Chile Standard Time</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className='mt-3 flex gap-2 item-center'>
                                <Checkbox onCheckedChange={(value: boolean) => setEnableLocalhostTracking(value)} /><span>Enable localhost tracking in development</span>
                            </div>
                            <Button className='mt-5 w-full' disabled={loading} type='submit'>
                                {loading ? <Loader2Icon className='animate-spin' /> :
                                    <Plus />}Add a Website</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default WebsiteForm