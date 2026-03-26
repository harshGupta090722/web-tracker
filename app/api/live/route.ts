import { db } from "@/configs/db";
import { liveUserTable } from "@/configs/schema";
import { and, eq, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(req: Request) {
    const origin = req.headers.get("origin") || "*";

    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { visitorId, websiteId, last_seen, url } = body;

        // 1 Parse device info from User-Agent
        const parser = new UAParser(req.headers.get("user-agent") || "");
        const deviceInfo = parser.getDevice()?.model || "";
        const osInfo = parser.getOS()?.name || "";
        const browserInfo = parser.getBrowser()?.name || "";

        // 2 Get IP from headers (or fallback)
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "71.71.22.54";

        // 3 Fetch geo-location info from IP
        let geoInfo: any = {};
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            geoInfo = await geoRes.json();
        } catch (e) {
            console.warn("Geo IP rate limit hit or timeout, skipping...");
        }

        // 4 Upsert into liveUser table
        await db
            .insert(liveUserTable)
            .values({
                visitorId,
                websiteId,
                last_seen,
                city: geoInfo.city || "",
                region: geoInfo.regionName || "",
                country: geoInfo.country || "",
                countryCode: geoInfo.countryCode || "",
                lat: geoInfo.lat?.toString() || "",
                lng: geoInfo.lon?.toString() || "",
                device: deviceInfo,
                os: osInfo,
                browser: browserInfo,
            })
            .onConflictDoUpdate({
                target: liveUserTable.visitorId,
                set: {
                    last_seen,
                    city: geoInfo.city || "",
                    region: geoInfo.regionName || "",
                    country: geoInfo.country || "",
                    countryCode: geoInfo.countryCode || "",
                    lat: geoInfo.lat?.toString() || "",
                    lng: geoInfo.lon?.toString() || "",
                    device: deviceInfo,
                    os: osInfo,
                    browser: browserInfo,
                },
            });
        return NextResponse.json(
            { message: "Data received successfully" },
            { headers: CORS_HEADERS }
        )
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { status: "error", message: err.message },
            { headers: CORS_HEADERS }
        );
    }
}

export async function GET(req: NextRequest) {
    const websiteId = req.nextUrl.searchParams.get("websiteId");
    const now = Date.now();

    const activeUsers = await db
        .select()
        .from(liveUserTable)
        .where(
            and(
                gt(liveUserTable.last_seen, String(now - 30_000)),
                eq(liveUserTable.websiteId, websiteId as string)
            )
        );

    return NextResponse.json(activeUsers);
}