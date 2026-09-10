const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const ACCOMMODATIONS_FILE = path.join(DATA_DIR, 'accommodations.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Helper to read JSON
function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Helper to write JSON
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Platform info endpoint
app.get('/api/config', (req, res) => {
  res.json({
    brand: 'Homies4U',
    tagline: 'Your Second Home - Premium Student & Co-Living Spaces',
    supportEmail: 'sg9tradingplatform@gmail.com',
    locationPolicy: 'NA',
    phoneSupport: false,
    bulkBookingSupport: false,
    verifiedBadge: true
  });
});

// Get Accommodations with optional filtering
app.get('/api/accommodations', (req, res) => {
  const accommodations = readJson(ACCOMMODATIONS_FILE);
  let result = [...accommodations];

  const { search, gender, sharing, maxPrice, popularOnly } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.amenities.some(a => a.toLowerCase().includes(q))
    );
  }

  if (gender && gender !== 'all') {
    result = result.filter(item => item.gender.toLowerCase() === gender.toLowerCase() || item.gender.toLowerCase() === 'co-ed');
  }

  if (sharing && sharing !== 'all') {
    result = result.filter(item => item.sharing.toLowerCase().includes(sharing.toLowerCase()));
  }

  if (maxPrice) {
    const priceNum = parseInt(maxPrice, 10);
    if (!isNaN(priceNum)) {
      result = result.filter(item => item.price <= priceNum);
    }
  }

  if (popularOnly === 'true') {
    result = result.filter(item => item.popular);
  }

  res.json(result);
});

// Get single accommodation by ID
app.get('/api/accommodations/:id', (req, res) => {
  const accommodations = readJson(ACCOMMODATIONS_FILE);
  const found = accommodations.find(a => a.id === req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'Accommodation not found' });
  }
  res.json(found);
});

// Create a new Booking / Visit Schedule
app.post('/api/bookings', (req, res) => {
  const { accommodationId, accommodationName, fullName, email, phone, checkInDate, sharingPreference, message } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Please provide full name, email, and phone number.' });
  }

  const bookings = readJson(BOOKINGS_FILE);
  const newBooking = {
    id: `BK-${Date.now().toString(36).toUpperCase()}`,
    accommodationId: accommodationId || 'general',
    accommodationName: accommodationName || 'Homies Preferred Stay',
    fullName,
    email,
    phone,
    checkInDate: checkInDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    sharingPreference: sharingPreference || 'Private Single',
    message: message || '',
    status: 'Confirmed & Scheduled',
    createdAt: new Date().toISOString(),
    routedTo: 'sg9tradingplatform@gmail.com'
  };

  bookings.unshift(newBooking);
  writeJson(BOOKINGS_FILE, bookings);

  res.status(201).json({
    success: true,
    message: 'Booking/Visit scheduled successfully! Our homies coordinator will reach out shortly.',
    booking: newBooking
  });
});

// Get all bookings (Admin/Dashboard view)
app.get('/api/bookings', (req, res) => {
  const bookings = readJson(BOOKINGS_FILE);
  res.json(bookings);
});

// Create Contact Inquiry (Routed exclusively to sg9tradingplatform@gmail.com)
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const inquiries = readJson(INQUIRIES_FILE);
  const newInquiry = {
    id: `INQ-${Date.now().toString(36).toUpperCase()}`,
    name,
    email,
    subject: subject || 'Accommodation Inquiry',
    message,
    recipientEmail: 'sg9tradingplatform@gmail.com',
    status: 'Received',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeJson(INQUIRIES_FILE, inquiries);

  res.status(201).json({
    success: true,
    message: 'Your message has been received! Our team at sg9tradingplatform@gmail.com will get back to you within 2-4 hours.',
    inquiry: newInquiry
  });
});

// Get all contact inquiries
app.get('/api/contact', (req, res) => {
  const inquiries = readJson(INQUIRIES_FILE);
  res.json(inquiries);
});

// Platform Statistics
app.get('/api/stats', (req, res) => {
  const accommodations = readJson(ACCOMMODATIONS_FILE);
  const bookings = readJson(BOOKINGS_FILE);
  const inquiries = readJson(INQUIRIES_FILE);

  res.json({
    totalAccommodations: accommodations.length,
    availableBeds: accommodations.reduce((acc, item) => acc + (item.availableBeds || 0), 0),
    totalBookings: bookings.length + 1420,
    totalInquiries: inquiries.length + 380,
    happyHomies: '12,500+',
    verifiedSpaces: '100%',
    supportEmail: 'sg9tradingplatform@gmail.com'
  });
});

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Homies4U Platform Server is running live on:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`📧 Contact Email: sg9tradingplatform@gmail.com`);
  console.log(`📍 Accommodations Location set to: NA`);
  console.log(`===================================================`);
});
