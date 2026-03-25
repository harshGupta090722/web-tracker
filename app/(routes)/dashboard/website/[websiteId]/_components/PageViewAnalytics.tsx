import { Card, CardContent } from '@/components/ui/card'
import { WebsiteInfoType } from '@/configs/type'
import React from 'react'
import LabelCountItem from './LabelCountItem';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    websiteInfo: WebsiteInfoType | null | undefined;
    loading?: boolean,
    analyticType: string,
    liveUserCount: number
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig


function PageViewAnalytics({ websiteInfo, loading, analyticType, liveUserCount }: Props) {
    const webAnalytics = websiteInfo?.analytics;
    return (
        <div className='mt-7 max-w-4xl'>
            {!loading ? <Card>

                <CardContent className='flex item-center p-5 gap-10'>
                    <LabelCountItem label="Visitors" value={webAnalytics?.totalVisitors} />
                    <Separator orientation="vertical" className='h-16' />

                    <LabelCountItem label="Total Page Views" value={webAnalytics?.totalSessions} />
                    <Separator orientation="vertical" className='h-16' />

                    <LabelCountItem label="Total Active Time" value={(Number(webAnalytics?.totalActiveTime) / 60).toFixed(2) + " m"} />
                    <Separator orientation="vertical" className='h-16' />

                    <LabelCountItem label="Avg Active Time" value={(Number(webAnalytics?.avgActiveTime) / 60).toFixed(2) + " m"} />
                    <Separator orientation="vertical" className='h-16' />

                    <LabelCountItem label="Live Users" value={liveUserCount ?? 0} />
                </CardContent>

                <CardContent className='p-5 mt-5'>

                    <ChartContainer config={chartConfig} className="h-96 w-full">
                        <AreaChart
                            accessibilityLayer
                            data={analyticType === 'hourly' ? webAnalytics?.hourlyVisitors : webAnalytics?.dailyVisitors}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 12,
                                bottom: 12
                            }}
                        >
                            <CartesianGrid vertical={false} />

                            <XAxis
                                dataKey={analyticType == 'hourly' ? "hourLabel" : "date"}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value?.toString().slice(0, 5) || value}
                            />

                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                width={30}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />

                            <Area
                                dataKey="count"
                                type="monotone"
                                fill="var(--color-primary)"
                                fillOpacity={0.4}
                                stroke="var(--color-primary)"
                            />

                        </AreaChart>
                    </ChartContainer>

                </CardContent>

            </Card>
                : <div>
                    <Skeleton className='w-full h-80 rounded-2xl' />
                </div>}
        </div>
    )
}

export default PageViewAnalytics