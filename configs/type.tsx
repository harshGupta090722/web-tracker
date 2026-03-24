export type WebsiteType = {
    id: number;
    websiteId: string;
    domain: string;
    timeZome: string;
    enableLocalhostTracking: boolean;
    userEmail: string;
}



export type WebsiteInfoType = {
    website: WebsiteType,
    analytics: AnalyticsType
}


export type AnalyticsType = {
    avgActiveTime: number,
    totalActiveTime: number,
    totalSessions: number,
    totalVisitors: number,
    hourlyVisitors: HourlyVisitorsType[],
    dailyVisitors: DailyVisitorsType[],
    referrals: Referrals[],
    refParams: RefParamsType[],
    countries: Countries[],
    cities: Cities[],
    regions: Regions[],
    devices: Device[],
    os: OS[],
    browsers: Browser[]
}

export type Device = {
    name: string,
    uv: number,
    image: string
}

export type OS = {
    name: string,
    uv: number,
    image: string
}

export type Browser = {
    name: string,
    uv: number
}

export type Countries = {
    image: string,
    name: string,
    uv: number
}

export type Cities = {
    name: string,
    image: string,
    uv: number
}

export type Regions = {
    name: string,
    image: string,
    uv: number
}

export type Referrals = {
    domainName: string,
    uv: number,
    name: string
}

export type RefParamsType = {
    name: string,
    uv: number
}

export type HourlyVisitorsType = {
    count: number,
    data: string,
    hour: number,
    hourLabel: string
}

export type DailyVisitorsType = {
    date: string,
    count: number
}

export const IMAGE_URL_FOR_DOMAINS = 'https://icons.duckduckgo.com/ip3/<domain>.com.ico'