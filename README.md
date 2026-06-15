# Web-Track — Self-Hosted Website Analytics Platform


WebTrack is a self-hosted, real-time website analytics and traffic tracking application built with Next.js. It allows users to register their websites, embed a lightweight JavaScript tracking snippet, and monitor visitor traffic, geolocation data, device specifications, and user engagement metrics in real-time.

---

## 🌐 Live Demo
👉 http://13.201.118.219/

---

## Features

- Real-time visitor tracking  
- Geo-location analytics (city, country)  
- Device, OS, browser detection  
- Referrer & UTM tracking  
- Interactive dashboards (charts & insights)  
-  Authentication with Clerk  
-  Serverless PostgreSQL (Neon DB)  
-  Fully typed with TypeScript  

---

## 🏗️ Tech Stack

- **Frontend & Backend**: Next.js (App Router)  
- **Database**: PostgreSQL (Neon)  
- **ORM**: Drizzle ORM  
- **Authentication**: Clerk  
- **Charts**: Recharts  
- **UI**: Tailwind + shadcn/ui  
- **Deployment**: AWS EC2 + Nginx  

---

## 🚀 Production Deployment (EC2)

### Build and start

```bash
npm run build
npm start