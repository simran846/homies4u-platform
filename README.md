 Homies4U - Modern Student & Co-Living Accommodation Platform

A complete end-to-end web platform for discovering, filtering, and booking verified student hostels and co-living residences.
⚡ Quick Start
 Run the Entire Project (Backend + Frontend)
```bash
cd homies4u-platform
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.
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
