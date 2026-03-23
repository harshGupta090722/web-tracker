import React, { useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WebsiteType } from '@/configs/type';
import { useParams, useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, RefreshCcw, Settings } from 'lucide-react';
import { DateRange } from 'react-day-picker';


type Props = {
    websiteList: WebsiteType[],
    setFormData: any,
    setReloadData: any
}


function FormInput({ websiteList, setFormData, setReloadData }: Props) {
    const { websiteId } = useParams();

    const today = new Date();

    const [date, setDate] = React.useState<DateRange>({
        from: today
    });

    const [analyticType, setAnalyticType] = React.useState<string>('hourly');
    const router = useRouter();

    const handleDateChange = (range?: DateRange) => {
        if (!range?.from)
            return;

        if (!range?.from && !range?.to) {
            setDate({ from: range }.from);
            return;
        }

        setDate({ from: range.from, to: range.to });
    };

    const handleToday = () => {
        setDate({ from: today, to: today });
    }

    const handleReset = () => {
        setDate({ from: today });
    }

    useEffect(() => {
        setFormData({
            analyticType: analyticType,
            fromDate: date?.from ?? today,
            toDate: date?.to ?? today
        })
    }, [date, analyticType])

    return (
        <div className="flex items-center gap-5 justify-between">
            <div className='flex items-center gap-5 '>
                <Select value={websiteId as string || ''} onValueChange={(v) => router.push('/dashboard/website/' + v)}>
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select a website" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Website</SelectLabel>
                            {websiteList?.map((website) => (
                                <SelectItem key={website.id} value={website.websiteId}>
                                    {website.domain.replace('https://', '')}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!date}
                            className="w-[280px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                        >
                            <CalendarIcon />

                            {date?.from ? (
                                date?.to ? (
                                    <>  {format(date?.from, 'PPP')} - {format(date?.to, 'PPP')}  </>
                                ) : (
                                    <>{format(date?.from, 'PPP')}</>
                                )) : (
                                <span>Pick a Date</span>
                            )}

                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[280px] p-0" align="start">
                        <div className='flex justify-between items-center my-3 mx-2'>
                            <Button variant='outline' onClick={handleToday}>Today</Button>
                            <Button variant='outline' onClick={handleReset}>Reset</Button>
                        </div>
                        <Calendar
                            mode="range"
                            selected={date}
                            defaultMonth={date?.from}
                            onSelect={handleDateChange}
                        />
                    </PopoverContent>

                </Popover>

                <Select value={analyticType} onValueChange={(value) => setAnalyticType(value)}>
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select a Time Range" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={()=>setReloadData(true)}><RefreshCcw /></Button>
            </div>
            <Button variant="outline"><Settings /></Button>
        </div >
    )
}

export default FormInput