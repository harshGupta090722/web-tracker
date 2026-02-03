import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from 'ua-parser-js';

export async function POST(req: NextRequest) {
  const rawBody = await req.json();
  const body = rawBody.data ?? rawBody;

  //fetch all required data from Analytics.js
  const parser = new UAParser(req.headers.get('user-agent') || '');
  const deviceInfo = parser.getDevice()?.model;
  const osInfo = parser.getOS()?.name;
  const browserInfo = parser.getBrowser()?.name;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || req.headers.get('x-real-ip') || '71.71.22.54';

  const geoRes = await fetch(`http://ip-api.com/json/71.71.22.54`);
  const geoInfo = await geoRes.json();


  console.log("Body Data:", body);
  console.log("Device Info:", deviceInfo);
  console.log("Os Info:", osInfo);
  console.log("Browser Info:", browserInfo);
  console.log("IP Address:", ip);
  console.log("Geo Info:", geoInfo);


  //Insert to DB
  console.log("FINAL websiteId:", body.websiteId);

  let result;

  if (body.type == 'entry') {
    result = await db.insert(pageViewTable).values({
      visitorId: body.visitorId,
      websiteId: body.websiteId,
      url: body.url,
      domain: body.domain,
      type: body.type,
      referrer: body.referrer,
      entryTime: body.entryTime,
      exitTime: body.exitTime,
      totalActiveTime: body.totalActiveTime,
      urlParams: body.urlParams,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      device: deviceInfo,
      os: osInfo,
      browser: browserInfo,
      city: geoInfo.city,
      region: geoInfo.regionName,
      country: geoInfo.country,
      ipAddress: ip || '',
      refParams: body.refParams,
    }).returning();
  } else {
    result = await db.update(pageViewTable).set({
      exitTime: body.exitTime,
      totalActiveTime: body.totalActiveTime,
    }).where(eq(pageViewTable.visitorId, body.visitorId)).returning();
  }

  console.log("Insert data:", result);

  return NextResponse.json({ message: "Data received successfylly", data: result })
}