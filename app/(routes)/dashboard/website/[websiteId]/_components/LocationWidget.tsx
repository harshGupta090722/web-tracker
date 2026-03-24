import { Card, CardContent } from '@/components/ui/card'
import { AnalyticsType, IMAGE_URL_FOR_DOMAINS } from '@/configs/type'
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


const BarLabelWithImage = (props: any) => {
  const { x, y, width, height, value } = props;
  const imageUrl = IMAGE_URL_FOR_DOMAINS?.replace("<domain>", value);
  return (
    <g transform={`translate(${x + 8}, ${y + height / 2 - 8})`}>
      <image href={imageUrl} width={16} height={16} />
      <text x={20} y={12} fontSize={12} fill="#ffffff">
        {value}
      </text>
    </g>
  );
};

function LocationWidget({ websiteAnalytics, loading }: Props) {
  return (
    <Card>
      <CardContent className='p-5'>
        <Tabs defaultValue="regions" className="w-full">
          <TabsList>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>

          </TabsList>

          <TabsContent value="regions">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={websiteAnalytics?.regions}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />

                <XAxis dataKey="uv" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Bar dataKey="uv"
                  layout="vertical"
                  fill="var(--color-primary)"
                  radius={4}
                >

                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={8}
                    opacity={0.7}
                    className="fill-(--color-label)"
                    fontSize={12}
                    content={<BarLabelWithImage />}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="countries">            <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={websiteAnalytics?.countries}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />

              <XAxis dataKey="uv" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Bar dataKey="uv"
                layout="vertical"
                fill="var(--color-primary)"
                radius={4}
              >

                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  opacity={0.7}
                  className="fill-(--color-label)"
                  fontSize={12}
                  content={<BarLabelWithImage />}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          </TabsContent>
          <TabsContent value="cities">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={websiteAnalytics?.cities}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />

                <XAxis dataKey="uv" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Bar dataKey="uv"
                  layout="vertical"
                  fill="var(--color-primary)"
                  radius={4}
                >

                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={8}
                    opacity={0.7}
                    className="fill-(--color-label)"
                    fontSize={12}
                    content={<BarLabelWithImage />}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default LocationWidget