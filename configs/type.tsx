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
    totalACtiveTime: number,
    totalVisitors: number,
    hourlyVisitors: HourlyVisitorsType[]
}

export type HourlyVisitorsType = {
    count: number,
    data: string,
    hour: number,
    hourLabel: string
}