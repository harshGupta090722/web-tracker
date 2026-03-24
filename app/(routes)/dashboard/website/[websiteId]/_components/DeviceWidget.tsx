import { Card, CardContent } from '@/components/ui/card'
import { AnalyticsType } from '@/configs/type'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

type Props = {
  websiteAnalytics: AnalyticsType | undefined,
  loading: boolean
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

const BarLabel = ({ x, y, width, height, value, index, data }: any) => {
  const image = data?.[index]?.image;
  return (
    <g transform={`translate(${x + 8}, ${y + height / 2 - 8})`}>
      {image && <image href={image} width={16} height={16} />}
      <text x={image ? 20 : 0} y={12} fontSize={12} fill="#ffffff">
        {value}
      </text>
    </g>
  );
};

function DeviceWidget({ websiteAnalytics, loading }: Props) {
  return (
    <Card>
      <CardContent className='p-5'>
        <Tabs defaultValue="devices" className="w-full">
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="os">OS</TabsTrigger>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
          </TabsList>

          <TabsContent value="devices">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={websiteAnalytics?.devices}
                layout="vertical"
                margin={{ right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
                <XAxis dataKey="uv" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="uv" layout="vertical" fill="var(--color-primary)" radius={4}>
                  <LabelList dataKey="name" position="insideLeft" offset={8} opacity={0.7} className="fill-(--color-label)" fontSize={12} content={(props) => <BarLabel {...props} data={websiteAnalytics?.devices} />} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="os">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={websiteAnalytics?.os}
                layout="vertical"
                margin={{ right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
                <XAxis dataKey="uv" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="uv" layout="vertical" fill="var(--color-primary)" radius={4}>
                  <LabelList dataKey="name" position="insideLeft" offset={8} opacity={0.7} className="fill-(--color-label)" fontSize={12} content={(props) => <BarLabel {...props} data={websiteAnalytics?.os} />} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="browsers">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={websiteAnalytics?.browsers}
                layout="vertical"
                margin={{ right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} hide />
                <XAxis dataKey="uv" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="uv" layout="vertical" fill="var(--color-primary)" radius={4}>
                  <LabelList dataKey="name" position="insideLeft" offset={8} opacity={0.7} className="fill-(--color-label)" fontSize={12} content={(props) => <BarLabel {...props} data={websiteAnalytics?.browsers} />} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default DeviceWidget