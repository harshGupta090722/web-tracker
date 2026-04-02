````md
# Web-Track — Self-Hosted Website Analytics Platform

Web-Track is a **full-stack analytics platform** (like Google Analytics) built with Next.js.  
It allows you to track visitors, analyze behavior, and visualize data — all on your own infrastructure.

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
````

---

### Run with PM2 (recommended)

```bash
npm install -g pm2
pm2 start npm --name "web-track" -- start
pm2 save
pm2 startup
```

---

### Nginx setup (reverse proxy)

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 📦 Database Commands

Push schema changes:

```bash
npx drizzle-kit push
```

Open DB studio:

```bash
npx drizzle-kit studio
```

---

## 📊 How It Works

1. Add this script to your website:

```html
<script 
  data-website-id="YOUR_ID"
  src="http://your-domain/analytics.js">
</script>
```

2. The script:

* Tracks user visits
* Sends data to `/api/track`
* Sends heartbeat to `/api/live`

3. Backend:

* Stores data in PostgreSQL
* Processes analytics

4. Dashboard:

* Displays charts and insights

---

## Key Concepts Learned

* Full-stack development with Next.js
* Server-side analytics processing
* Real-time tracking systems
* Reverse proxy with Nginx
* Deployment on AWS EC2

---

##  Future Improvements

* HTTPS (SSL with Let's Encrypt)
* Domain integration
* Caching with Redis
* Advanced analytics (funnels, retention)

---

## 👨‍💻 Author

**Harsh Gupta**

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

```
```
