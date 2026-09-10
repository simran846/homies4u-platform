# Homies4U - Modern Student & Co-Living Accommodation Platform

A complete end-to-end web platform for discovering, filtering, and booking verified student hostels and co-living residences.

---

## ⚡ Quick Start

### 1. Run the Entire Project (Backend + Frontend)
```bash
cd homies4u-platform
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 📁 Project Structure (Frontend & Backend Separated)

```
homies4u-platform/
│
├── 🎨 frontend/                <-- All Frontend UI, Styles & Assets
│   ├── css/
│   │   └── style.css          <-- Design system, responsive layout & styling
│   ├── js/
│   │   └── app.js             <-- Client interactive logic, search & API calls
│   ├── images/                <-- High-resolution AI generated house images
│   │   ├── deluxe_studio.jpg
│   │   ├── twin_suite.jpg
│   │   ├── house_exterior.jpg
│   │   └── luxury_suite.jpg
│   └── index.html             <-- Master landing page HTML5
│
├── ⚙️ backend/                 <-- All Backend Server, APIs & Database
│   ├── data/                  <-- JSON Database Storage
│   │   ├── accommodations.json <-- Listings with AI images & Location: NA
│   │   ├── bookings.json       <-- Saved room reservations & visits
│   │   └── inquiries.json      <-- Contact messages (sg9tradingplatform@gmail.com)
│   ├── server.js              <-- Express.js REST API & static server
│   └── package.json           <-- Backend dependencies (Express, CORS)
│
├── package.json               <-- Root configuration & launch scripts
├── .gitignore                 <-- Git ignore rules
└── README.md                  <-- Project documentation
```

---

## 🛠 Features & Modifications Included

- **AI-Generated House & Suite Imagery**: Real high-resolution visuals across listings and hero cards.
- **Location Tag**: Designated as **`NA`** on all accommodation cards, badges, and detail views.
- **Repositioned "About Us"**: Placed down near the bottom directly above Contact Us & Footer.
- **Removed Sections**: "Home Gear" and "Homies Experience Video Reviews" are completely removed.
- **Customized Contact Section**:
  - Removed corporate office location tab.
  - Removed phone and bulk bookings options.
  - Email tab explicitly displays and connects to **`sg9tradingplatform@gmail.com`**.
  - Interactive message form that persists inquiries directly to the backend.
- **Booking & Visit Scheduling Engine**: Book room visits with live backend persistence (`/api/bookings`).
- **Live Leads Viewer**: Accessible from the top bar to inspect all incoming reservations and contact messages in real time.
- **Dynamic Search & Filtering**: Filter by category, resident gender (Boys, Girls, Co-ed), and maximum budget.
