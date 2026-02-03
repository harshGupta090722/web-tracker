import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { WebsiteInfoType, WebsiteType } from '@/configs/type'
import { Globe } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

type Props = {
    websiteInfo: WebsiteInfoType
}

function WebsiteCard({ websiteInfo }: Props) {

    const hourlyData = websiteInfo?.analytics?.hourlyVisitors;

    const chartData = hourlyData?.length == 1 ?
        [
            {
                ...hourlyData[0],
                hour: Number(hourlyData[0].hour) - 1 >= 0 ? Number(hourlyData[0].hour) - 1 : 0,
                count: 0,
                hourLabel: `${Number(hourlyData[0].hour) - 1} AM/PM `
            },
            hourlyData[0]
        ] : hourlyData;



    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className='flex gap-2 items-center'>
                            <Globe className='h-8 w-8 p-2 rounded-md bg-primary'></Globe>
                            <h2 className='font-bold text-lg'>{websiteInfo?.website?.domain.replace('https://', ' ')}</h2>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className='max-h-20 w-full'>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 16,
                                right: 16,
                            }}
                        >
                            <CartesianGrid vertical={true} />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="var(--color-desktop)"
                                fillOpacity={0.0}
                                stroke="var(--color-desktop)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ChartContainer>
                    <h2 className='text-sm mt-1'><strong>{websiteInfo?.analytics?.totalVisitors} Visitors</strong></h2>
                </CardContent>
            </Card>
        </div >
    )
}

export default WebsiteCard