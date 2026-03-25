# Web-Track: The Complete Learning Guide

> **Goal**: This document will help you understand this project deeply, rebuild it from scratch, and carry the architectural knowledge into every future project.

---

## 1. What Is This Project?

**web-track** is a **website analytics platform** — similar to Google Analytics but self-hosted. It does three things:

1. **Tracks** every visitor on an external website via a tiny JavaScript snippet ([public/analytics.js](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/public/analytics.js)).
2. **Stores** structured visit data (pages, devices, location, time, UTM params) in a PostgreSQL database.
3. **Displays** rich analytics dashboards to authenticated website owners.

---

## 2. The Big Picture — System Architecture

```
Your Website (external)
    |
    |  <script data-website-id="xyz" src="https://your-app.com/analytics.js">
    ↓
analytics.js (runs in the visitor's browser)
    |
    |  POST /api/track   (on page load → "entry")
    |  POST /api/track   (on tab close → "exit")
    |  POST /api/live    (every 10 seconds → "heartbeat")
    ↓
Next.js API Routes  (your server)
    |
    | → Reads User-Agent header (device/OS/browser)
    | → Calls ip-api.com for geo info (city, country, lat/lng)
    | → Writes to NeonDB (PostgreSQL)
    ↓
NeonDB (PostgreSQL)
    |
    |  pageViews table
    |  liveUser table
    |  websites table
    |  users table
    ↓
Dashboard (Next.js frontend)
    |
    |  GET /api/website?websiteId=xyz&from=...&to=...
    |  → Server computes: unique visitors, sessions, referrals,
    |    devices, countries, hourly/daily charts, etc.
    ↓
React Components + Recharts (renders the data)
```

---

## 3. Next.js — How It Works Here

> [!NOTE]
> Next.js is a **full-stack framework**. The same project is both your backend (API routes) and your frontend (React UI). You don't need a separate Express server.

### 3.1 The `app/` Directory and File-Based Routing

Every **folder** inside `app/` becomes a **URL path**. Files named [page.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/page.tsx) become the rendered page.

| File | URL |
|---|---|
| [app/page.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/page.tsx) | `/` (landing page) |
| [app/(routes)/dashboard/page.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/%28routes%29/dashboard/page.tsx) | `/dashboard` |
| [app/(routes)/dashboard/website/[websiteId]/page.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/%28routes%29/dashboard/website/%5BwebsiteId%5D/page.tsx) | `/dashboard/website/abc123` |

**Key files in any route folder:**
- [page.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/page.tsx) → the page content
- [layout.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/layout.tsx) → wrapper around children (nav, sidebar, etc.)

### 3.2 Route Groups — [(routes)](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/configs/type.tsx#41-46) and [(auth)](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/configs/type.tsx#41-46)

Folders wrapped in parentheses like [(routes)](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/configs/type.tsx#41-46) are **route groups**. They let you organize files without affecting the URL. 

```
app/
  (auth)/          ← doesn't appear in URL
    sign-in/
      page.tsx     → /sign-in
  (routes)/        ← doesn't appear in URL
    dashboard/
      page.tsx     → /dashboard
```

**Why**: You can apply different layouts to different groups. Auth pages get a blank layout. Dashboard pages get a sidebar layout.

### 3.3 Dynamic Segments — `[websiteId]`

Folders named `[paramName]` are **dynamic routes**. The param is available inside the component:

```tsx
// app/(routes)/dashboard/website/[websiteId]/page.tsx
const { websiteId } = useParams(); // → "abc123"
```

**On the server** (API routes), use `req.nextUrl.searchParams.get("websiteId")`.

### 3.4 API Routes — [route.ts](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/api/website/route.ts) / [route.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/api/live/route.tsx)

A file named [route.ts](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/api/website/route.ts) inside `app/api/...` becomes an **HTTP endpoint**. Export named functions for each HTTP method:

```
app/api/track/route.tsx  →  POST /api/track
app/api/live/route.tsx   →  GET /api/live, POST /api/live
app/api/website/route.ts →  GET /api/website, POST /api/website
```

```ts
// Named exports = HTTP methods
export async function GET(req: NextRequest) { ... }
export async function POST(req: NextRequest) { ... }
```

**Key objects:**
- `req.nextUrl.searchParams.get("key")` → read query params
- `req.json()` → read JSON body
- `req.headers.get("user-agent")` → read headers
- `NextResponse.json(data)` → send JSON response
- `NextResponse.json(data, { status: 401 })` → send with status code

### 3.5 Server vs. Client Components

By default, every component in Next.js App Router is a **Server Component** — it runs on the server and the user gets pure HTML. 

Add `"use client"` at the top to make it a **Client Component** — it runs in the browser and can use `useState`, `useEffect`, event handlers, etc.

**Rule of thumb:**
- Pages that fetch data on load + have no interactivity → Server Component
- Pages with `useState`, `useEffect`, forms, click handlers → add `"use client"`

In this project, the dashboard page is `"use client"` because it uses `useState` and `useEffect` to load data.

### 3.6 Middleware — [middleware.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/middleware.tsx)

[middleware.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/middleware.tsx) in the root runs **before every request**. Here it protects all routes except sign-in, sign-up, and the landing page using Clerk:

```ts
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect() // redirect to /sign-in if not logged in
  }
})
```

**The `matcher` config** tells Next.js which paths middleware should run on (skips static files like [.png](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/image.png), [.css](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/globals.css)).

---

## 4. All Libraries Explained

### Authentication — `@clerk/nextjs`
Clerk is a fully managed auth provider. You wrap your app in `<ClerkProvider>`, and then:
- `currentUser()` on the server → gets the logged-in user's info
- `<SignInButton>`, `<UserButton>` → pre-built React components
- [middleware.tsx](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/middleware.tsx) → auto-protect private routes

**Why Clerk and not custom auth?** Rolling your own auth (JWT, sessions, passwords) is complex and error-prone. Clerk handles it all.

### Database ORM — `drizzle-orm`
Drizzle is a **type-safe SQL query builder** for TypeScript. You define your database schema in TypeScript, and Drizzle generates the correct SQL.

```ts
// Schema definition
export const pageViewTable = pgTable('pageViews', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar({ length: 2048 }),
  ...
})

// Querying
const rows = await db.select().from(pageViewTable).where(eq(pageViewTable.websiteId, 'abc'))
```

**Key operations:**
| Operation | Code |
|---|---|
| Insert | `db.insert(table).values({...})` |
| Select all | `db.select().from(table)` |
| Select with filter | `.where(eq(table.column, value))` |
| Update | `db.update(table).set({...}).where(...)` |
| Upsert | `.insert(...).onConflictDoUpdate({target, set})` |

**`drizzle-kit`** (dev dependency) is the CLI tool that reads your schema and runs migrations against the database: `npx drizzle-kit push`.

### Database — `@neondatabase/serverless`
NeonDB is a **serverless PostgreSQL** provider. Perfect for Next.js because normal PostgreSQL keeps a persistent connection, which doesn't work well with serverless functions. Neon uses HTTP-based queries instead.

```ts
const sql = neon(process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!)
const db = drizzle(sql)  // drizzle on top of neon
```

### Device Detection — `ua-parser-js`
Parses the `User-Agent` HTTP header string into structured data.

```ts
const parser = new UAParser(req.headers.get('user-agent') || '')
parser.getDevice()?.model  // "iPhone", "Samsung Galaxy"
parser.getOS()?.name       // "Windows", "iOS", "Android"
parser.getBrowser()?.name  // "Chrome", "Firefox", "Safari"
```

**Why**: The browser sends a long string like `"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 ...)"`. Parsing it manually would be fragile.

### HTTP Client — `axios`
Used in the frontend to call our own API routes. Like `fetch` but with shorter syntax and automatic JSON parsing.

```ts
const res = await axios.get('/api/website?websiteId=abc')
res.data  // already parsed JSON
```

### Charts — `recharts`
React charting library. This project uses `AreaChart` for the visitor timeline. You pass data as an array of objects and map properties to chart axes.

```tsx
<AreaChart data={[{ hour: '2 PM', count: 14 }, ...]}>
  <XAxis dataKey="hour" />
  <Area dataKey="count" />
</AreaChart>
```

### Date Utilities — `date-fns` + `date-fns-tz`
- **`date-fns`**: [format(date, 'yyyy-MM-dd')](file:///home/harshgupta/Harsh/WEB-D/Projects/Ongoing-Projects/web-track/app/api/website/route.ts#155-166) — safe, locale-agnostic date formatting.
- **`date-fns-tz`**: `toZonedTime(date, timezone)` — converts a UTC date to a specific timezone (e.g., convert UTC midnight to IST for the chart).

**Why timezone matters**: Your server is in UTC. A visitor at 11 PM IST would show up in the "next day" if you didn't convert to their timezone.

### Forms — `react-hook-form` + `zod`
- **`react-hook-form`**: Manages form state, validation, and submissions without re-rendering the whole component on each keystroke.
- **`zod`**: Schema validation library. Define what shape data should be, and Zod will throw descriptive errors if it doesn't match.
- **`@hookform/resolvers`**: Bridge between the two — plug a Zod schema into react-hook-form.

### UI Components — `shadcn/ui` (Radix UI + Tailwind)
The `components/ui/` folder contains shadcn/ui components like `<Card>`, `<Button>`, `<Skeleton>`, `<Separator>`. These are pre-built accessible components using:
- **Radix UI** (`@radix-ui/*`): Fully accessible, unstyled, behavior-only primitives (dialogs, dropdowns, tooltips, etc.)
- **Tailwind CSS**: Utility classes for styling
- **`class-variance-authority` (CVA)**: Creates component variants (e.g., `<Button variant="outline" size="sm">`)
- **`clsx` + `tailwind-merge`**: Utilities to safely merge className strings without conflicts

### Notifications — `sonner`
Toast notification library. Shows small pop-up messages at the corner of the screen.

```tsx
import { toast } from 'sonner'
toast.success('Website added!')
toast.error('Something went wrong')
```

### Theme — `next-themes`
Manages light/dark mode. Wraps the app and listens for system preference or user toggle.

---

## 5. The Database Schema — 4 Tables

```
┌─────────────┐       ┌───────────────────────────────┐
│   users     │       │         pageViews             │
├─────────────┤       ├───────────────────────────────┤
│ id (PK)     │       │ id (PK)                       │
│ name        │       │ visitorId  ← UUID from browser│
│ email       │       │ websiteId  ← FK to websites   │
└─────────────┘       │ domain                        │
                      │ url                           │
┌─────────────────┐   │ type ('entry' | 'exit')       │
│   websites      │   │ referrer                      │
├─────────────────┤   │ entryTime  ← Unix timestamp   │
│ id (PK)         │   │ exitTime                      │
│ websiteId (UQ)  │   │ totalActiveTime (seconds)     │
│ domain (UQ)     │   │ utm_source/medium/campaign    │
│ timeZone        │   │ device / os / browser         │
│ enableLocalhost │   │ city / region / country       │
│ userEmail       │   │ countryCode / ipAddress       │
└─────────────────┘   └───────────────────────────────┘

┌────────────────────────────────┐
│         liveUser               │
├────────────────────────────────┤
│ id (PK)                        │
│ visitorId (UNIQUE) ← upserted  │
│ websiteId                      │
│ last_seen ← stringified ms     │
│ city / region / country        │
│ lat / lng                      │
│ device / os / browser          │
└────────────────────────────────┘
```

**Design decisions to understand:**
- `entryTime` is stored as a **Unix timestamp string** (seconds since epoch). Numeric comparison works correctly even as a string for SQL's `:: bigint` cast.
- `liveUser` uses `UNIQUE` on `visitorId` + `onConflictDoUpdate` — this is an **UPSERT** pattern. If the visitor is already there, update their `last_seen` instead of inserting a duplicate.
- `pageViews` stores **both** `entry` and `exit` records using the same `visitorId`. The exit event **updates** the entry record (fill in `exitTime` and `totalActiveTime`).

---

## 6. The Full Data Flow — Trace a Single Visitor

### Step 1 — Visitor Arrives

Browser loads the external website. The `<script>` tag triggers `analytics.js`.

The script:
1. Checks `localStorage` for an existing `visitorId` and session. If expired (>12h), creates a new UUID.
2. Reads `data-website-id` and `data-domain` from the `<script>` tag.
3. Collects `referrer`, `url`, UTM params from the URL.
4. `POST /api/track` with `type: 'entry'` and all collected data.
5. Starts a `setInterval` to `POST /api/live` every **10 seconds**.
6. Attaches `beforeunload` event → fires `POST /api/track` with `type: 'exit'` when tab closes.

### Step 2 — API Route Receives the Data (`/api/track`)

```
POST body → { type: 'entry', visitorId, websiteId, url, referrer, entryTime, ... }
```

The route:
1. Parses `User-Agent` header → extracts device/OS/browser.
2. Gets IP from `x-forwarded-for` header.
3. `fetch('http://ip-api.com/json/{ip}')` → gets city, country, lat/lng.
4. If `type === 'entry'` → `db.insert(pageViewTable)` with all fields.
5. If `type === 'exit'` → `db.update(pageViewTable).where(visitorId)` to fill exit data.

### Step 3 — Live Heartbeat (`/api/live`)

Every 10 seconds, `analytics.js` sends:
```json
{ "visitorId": "...", "websiteId": "...", "last_seen": "1711234567890" }
```
The route **upserts** into `liveUser`. The `last_seen` is the current millisecond timestamp.

The `GET /api/live?websiteId=xyz` returns all users where `last_seen > (now - 30000)` — anyone seen in the last 30 seconds is "live".

### Step 4 — Dashboard Fetches Analytics (`/api/website`)

```
GET /api/website?websiteId=abc&from=2024-01-01&to=2024-01-07
```

The route:
1. Verifies the logged-in user (Clerk `currentUser()`).
2. Fetches all `pageViews` rows for the website in the date range.
3. Loops through rows and **computes everything in memory** using JavaScript Maps/Sets:
   - Unique visitors (`Set<visitorId>`)
   - Hourly/daily buckets
   - Device/OS/browser/country/city breakdowns
4. Returns the fully computed `AnalyticsType` object.

### Step 5 — Frontend Renders

The dashboard `page.tsx`:
1. `useEffect` → calls `GetWebsiteAnalyticDetail()` on mount and when date range changes.
2. Passes `websiteInfo.analytics` to each widget component.
3. `PageViewAnalytics` → Recharts `AreaChart` with hourly/daily visitor data.
4. `SourceWidget` → referrals, UTM sources.
5. `LocationWidget` → countries, cities, regions with flag images.
6. `DeviceWidget` → device, OS, browser with icon images.

---

## 7. What to Send — API Contract Reference

### `POST /api/track` (from analytics.js)

```json
{
  "type": "entry",              // REQUIRED: "entry" | "exit"
  "visitorId": "abc123def",     // REQUIRED: UUID from localStorage
  "websiteId": "your-id",       // REQUIRED: from script tag
  "domain": "example.com",      // REQUIRED
  "url": "https://...",         // full current URL
  "referrer": "https://google.com", // or "Direct"
  "entryTime": 1711234567,      // Unix seconds (Math.floor(Date.now()/1000))
  "exitTime": null,             // filled on exit
  "totalActiveTime": 0,         // seconds, filled on exit
  "utm_source": "",
  "utm_medium": "",
  "urlParams": "..."
}
```

For `exit` events, only `type`, `visitorId`, `exitTime`, `totalActiveTime`, `exitUrl` are needed.

### `POST /api/live` (heartbeat)

```json
{
  "visitorId": "abc123def",
  "websiteId": "your-id",
  "last_seen": "1711234567890",  // Date.now().toString() — milliseconds as STRING
  "url": "https://..."
}
```

### `GET /api/website` (dashboard)

| Query Param | Required? | Example |
|---|---|---|
| `websiteId` | No (returns all sites) | `abc123` |
| `from` | No | `2024-01-01` |
| `to` | No | `2024-01-07` |
| `websiteOnly` | No | `true` (skip analytics) |

---

## 8. How TypeScript Fits In

All types are in `configs/type.tsx`. TypeScript gives you:
- **Autocompletion**: When you write `websiteInfo?.analytics.`, TS shows all available fields.
- **Compile-time safety**: If you pass wrong data shapes, TypeScript (not the user) catches it first.

**Key pattern — typing API response:**
```ts
const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>();
const res = await axios.get('/api/website');
setWebsiteInfo(res.data[0]); // TypeScript knows what this contains
```

> [!IMPORTANT]
> Never use `any` unless absolutely necessary. Prefer defining an explicit type.

---

## 9. Do's and Don'ts

### Next.js API Routes
| ✅ DO | ❌ DON'T |
|---|---|
| Export named async functions (`GET`, `POST`) | Export default functions |
| Use `NextRequest` for request type | Use `Request` (misses Next.js-specific methods) |
| Use `req.nextUrl.searchParams` for query params | Use `req.url` and parse manually |
| Return `NextResponse.json()` | `return Response.json()` (works but inconsistent) |
| Handle async errors with try/catch | Let unhandled promise rejections crash the route |

### Database (Drizzle)
| ✅ DO | ❌ DON'T |
|---|---|
| Use Drizzle `eq()`, `and()`, `gt()` for where clauses | Write raw SQL strings |
| Define schema in TypeScript, let Drizzle manage types | Keep schema only in SQL files |
| Use `.returning()` after insert to get the created row | Do a separate select after insert |
| Validate/clamp numeric values before inserting (see `safeTotalActiveTime`) | Trust arbitrary user input without bounds checking |

### Frontend
| ✅ DO | ❌ DON'T |
|---|---|
| Use `"use client"` only where state/effects are needed | Add `"use client"` to every file |
| Show loading skeletons (`<Skeleton>`) while data loads | Show blank screens |
| Handle null/undefined with `?` optional chaining | Access nested properties directly (causes crashes) |
| Lift state up to the parent that needs to share it | Prop-drill through excessive layers |

### Analytics Script
| ✅ DO | ❌ DON'T |
|---|---|
| Use `keepalive: true` in exit fetch (browser may kill it) | Use regular fetch without keepalive on `beforeunload` |
| Store `visitorId` in `localStorage` for session tracking | Use cookies (more complex, GDPR issues) |
| Read `data-*` attributes from `document.currentScript` | Hardcode IDs in the script |

---

## 10. Rebuild Guide — Step by Step (Learning by Doing)

> [!IMPORTANT]
> Read the section for each step BEFORE writing any code for that step.

### Phase 1 — Project Foundation (Day 1)

1. **Create the project**: `npx create-next-app@latest`
   - TypeScript: Yes | Tailwind: Yes | App Router: Yes | src/ dir: No
2. **Add shadcn/ui**: `npx shadcn@latest init` → adds `components/ui/`
3. **Set up environment variables** in `.env.local`:
   - `NEXT_PUBLIC_NEON_DB_CONNECTION_STRING` from [neon.tech](https://neon.tech)
   - Clerk keys from [clerk.com](https://clerk.com)
4. **Connect Neon**: Copy the `configs/db.ts` pattern — Neon client → Drizzle wrapper
5. **Write the schema** in `configs/schema.ts` — 4 tables: `users`, `websites`, `pageViews`, `liveUser`
6. **Push schema to DB**: `npx drizzle-kit push`
7. **What you learn**: Project setup, environment configuration, Drizzle schema definition, DB migration

### Phase 2 — Authentication (Day 1-2)

1. **Install Clerk**: `npm install @clerk/nextjs`
2. **Wrap the app** in `<ClerkProvider>` in `app/layout.tsx`
3. **Add middleware** `middleware.tsx` — protect all routes except `/`, `/sign-in`, `/sign-up`
4. **Add auth pages** using Clerk's built-in pages (or Route Group for custom pages)
5. **Test**: Visit `/dashboard` without login — should redirect to `/sign-in`
6. **What you learn**: Clerk integration, Next.js middleware, route protection patterns

### Phase 3 — The Tracking Script (Day 2)

1. **Create `public/analytics.js`** as an IIFE (Immediately Invoked Function Expression)
2. **Implement**:
   - UUID generation + localStorage session management
   - Read `data-website-id` from `document.currentScript`
   - Collect `referrer`, URL, UTM params
   - `POST /api/track` on entry
   - `beforeunload` for exit tracking
   - `setInterval` for live ping every 10s
3. **Test it**: Add the script tag to a plain HTML file served elsewhere. Check the network tab.
4. **What you learn**: IIFE pattern, localStorage, event listeners, keepalive fetch, UTM params

### Phase 4 — API Routes (Day 3)

1. **`POST /api/track`**
   - Parse `user-agent` with `ua-parser-js`
   - Get IP from headers
   - Call `ip-api.com` for geo data
   - Conditional insert vs update based on `type`
2. **`POST /api/live`** (upsert pattern)
3. **`GET /api/live`** → filter by `last_seen > now - 30s`
4. **`GET + POST /api/website`**
   - POST: create new website (check for duplicate domain first)
   - GET: fetch analytics with all computations
5. **What you learn**: API route patterns, User-Agent parsing, IP geolocation, upsert pattern, server-side data computation

### Phase 5 — Dashboard UI (Day 4-5)

1. **Dashboard layout** with sidebar (list of tracked websites)
2. **"Add Website" flow** — form → `POST /api/website` → show script snippet
3. **Website detail page** (`/dashboard/website/[websiteId]`)
   - Use `useParams()` to get the dynamic ID
   - `useEffect` to fetch analytics on mount
   - Date range picker using `react-day-picker`
4. **`PageViewAnalytics`** — Recharts AreaChart, KPI cards
5. **Widget components** — Source, Location, Device
6. **What you learn**: Client components, data fetching patterns, dynamic routes, Recharts, component composition

### Phase 6 — Polish (Day 5-6)

1. **Loading states** — `<Skeleton>` while fetching
2. **Error handling** — `toast.error()` on failures
3. **Type safety** — make sure `AnalyticsType` is fully typed and used everywhere
4. **What you learn**: UX patterns, sonnner toasts, TypeScript strictness

---

## 11. Architecture Concepts to Carry Into Future Projects

### The Tracker Pattern (Embed Snippet → API → Database)
This same pattern is used by: Google Analytics, Hotjar, Segment, Mixpanel. The script is always:
1. A self-contained IIFE (doesn't pollute global scope).
2. Reads config from `data-*` attributes.
3. Sends events to an API endpoint.
4. Manages session identity in `localStorage`.

### Upsert (Insert-or-Update)
When you need "create if not exists, update if exists" — use `onConflictDoUpdate`. This is common in analytics, presence systems (who's online), and idempotent operations.

### Server-Side Analytics Computation
This project computes analytics **on read** (when the GET request comes in). An alternative is computing **on write** (pre-aggregate when data comes in). Trade-offs:
- **On read** (this project): Simple, flexible date filtering, slower for huge data.
- **On write**: Fast reads, but harder to change logic later.

### Route Groups for Layout Isolation
Use `(group)` folders when different sections of your app need completely different layouts (auth pages vs. app pages vs. marketing pages).

### TypeScript Types as Documentation
The `configs/type.tsx` file is effectively the **API contract** — it documents exactly what shape data flows between your frontend and backend. Always define types before writing code.

---

## 12. Knowledge Extraction Checklist

After rebuilding, ask yourself:

- [ ] Can I explain why `"use client"` is needed on the dashboard page but not the API route?
- [ ] Can I draw the data flow from browser → API → DB → frontend on a whiteboard?
- [ ] Do I understand why `last_seen` is stored as a string but compared numerically?
- [ ] Can I explain the difference between `entry` and `exit` events in `pageViews`?
- [ ] Do I understand why we use Neon (serverless) instead of a regular PostgreSQL pool?
- [ ] Can I modify the analytics query to also return page-level visit counts?
- [ ] What happens if `ip-api.com` is down? (Look at the error handling in `/api/live`)
- [ ] Why does the tracking script use `keepalive: true` on the exit fetch?
- [ ] Can I add a new field (e.g., screen resolution) end-to-end by myself?
