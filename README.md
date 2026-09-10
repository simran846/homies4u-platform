# Homies4U - Modern Student & Co-Living Accommodation Platform

A complete end-to-end web platform for discovering, filtering, and booking verified student hostels and co-living residences.

---

## ⚡ Quick Start

1. Open your terminal in this directory:
   ```bash
   cd C:\Users\USER\.gemini\antigravity-ide\scratch\homies4u-platform
   ```
2. Start the application:
   ```bash
   npm start
   ```
3. Open your browser at:
   **[http://localhost:5000](http://localhost:5000)**

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

---

## 📁 Directory Structure

```
homies4u-platform/
├── data/
│   ├── accommodations.json   # Property listings with AI imagery & NA location
│   ├── bookings.json         # Real-time bookings storage
│   └── inquiries.json        # Contact submissions for sg9tradingplatform@gmail.com
├── public/
│   ├── css/
│   │   └── style.css         # Modern design system & styling
│   ├── js/
│   │   └── app.js            # Client-side reactivity & API integration
│   ├── images/               # High-res AI house & suite images
│   └── index.html            # Main landing page
├── server.js                 # Express REST backend
└── package.json
```
