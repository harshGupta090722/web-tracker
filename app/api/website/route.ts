import { db } from "@/configs/db";
import { websitesTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { websiteId, domain, timeZone, enableLocalhostTracking } = await req.json();
    const user = await currentUser();

    const existingDomain = await db.select().from(websitesTable)
        .where(and(eq(websitesTable?.domain, domain),
            eq(websitesTable?.userEmail, user?.primaryEmailAddress?.emailAddress as string)));

    if (existingDomain.length > 0) {
        return NextResponse.json({ message: 'Domain already exists', data: existingDomain[0] })
    }

    const result = await db.insert(websitesTable).values({
        domain: domain,
        websiteId: websiteId,
        timeZone: timeZone,
        enableLocalhostTracking: enableLocalhostTracking,
        userEmail: user?.primaryEmailAddress?.emailAddress as string
    }).returning();

    return NextResponse.json(result);
}