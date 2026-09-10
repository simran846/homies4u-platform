/**
 * HOMIES4U - CLIENT APPLICATION LOGIC
 * End-to-end interactive student housing & co-living platform
 */

// State
let accommodationsData = [];
let currentFilter = 'all';
let currentGenderFilter = 'all';
let currentMaxPrice = 25000;
let searchQuery = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  await fetchAccommodations();
  setupEventListeners();
  setupFaqAccordion();
  fetchStats();
}

// Fetch Accommodations from Backend API
async function fetchAccommodations() {
  try {
    const res = await fetch('/api/accommodations');
    if (!res.ok) throw new Error('Failed to fetch accommodations');
    accommodationsData = await res.json();
    renderAccommodations(accommodationsData);
  } catch (err) {
    console.error('Error loading accommodations:', err);
    // Fallback if offline
    showToast('Failed to load listings from server.', 'error');
  }
}

// Render Accommodation Cards (with AI Images & Location NA)
function renderAccommodations(items) {
  const container = document.getElementById('accommodationsGrid');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🏠</div>
        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No accommodations match your criteria</h3>
        <p style="color: #64748b; margin-bottom: 16px;">Try adjusting your filters or price range.</p>
        <button class="btn btn-outline btn-sm" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="accommodation-card" data-id="${item.id}">
      <div class="card-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <span class="card-badge-top ${item.badge === 'Top Rated' || item.badge === 'Popular Choice' ? 'badge-hot' : ''}">
          ✦ ${item.badge || 'Verified'}
        </span>
        <span class="card-badge-gender">${item.gender}</span>
      </div>

      <div class="card-body">
        <div class="card-rating-row">
          <div class="rating-badge">★ ${item.rating} <span style="font-size: 0.72rem; color: #78350F; font-weight: normal;">(${item.reviewsCount})</span></div>
          <div class="location-indicator" title="Location specified as NA">
            📍 Location: <strong>${item.location || 'NA'}</strong>
          </div>
        </div>

        <h3 class="card-title">${item.name}</h3>
        <p class="card-room-type">${item.type} • ${item.sharing}</p>

        <div class="card-amenities-pills">
          ${item.amenities.slice(0, 4).map(a => `<span class="amenity-pill">✓ ${a}</span>`).join('')}
          ${item.amenities.length > 4 ? `<span class="amenity-pill">+${item.amenities.length - 4} more</span>` : ''}
        </div>

        <div class="card-footer">
          <div class="price-container">
            <span class="price-label">Starting from</span>
            <div class="price-val">₹${item.price.toLocaleString()}<span class="period">/mo</span></div>
          </div>
          <div class="card-btn-group">
            <button class="btn btn-outline btn-sm" onclick="openDetailsModal('${item.id}')">View Details</button>
            <button class="btn btn-primary btn-sm" onclick="openBookingModal('${item.id}')">Book Visit</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

// Filter and Search Logic
function applyFilters() {
  let filtered = [...accommodationsData];

  // Sharing / Category Tab Filter
  if (currentFilter !== 'all') {
    if (currentFilter === 'single') {
      filtered = filtered.filter(a => a.sharing.toLowerCase().includes('single'));
    } else if (currentFilter === 'twin') {
      filtered = filtered.filter(a => a.sharing.toLowerCase().includes('twin'));
    } else if (currentFilter === 'luxury') {
      filtered = filtered.filter(a => a.type.toLowerCase().includes('luxury') || a.price >= 13500);
    }
  }

  // Gender Filter
  if (currentGenderFilter !== 'all') {
    filtered = filtered.filter(a => a.gender.toLowerCase() === currentGenderFilter.toLowerCase() || a.gender.toLowerCase() === 'co-ed');
  }

  // Search Query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.sharing.toLowerCase().includes(q) ||
      a.amenities.some(amenity => amenity.toLowerCase().includes(q))
    );
  }

  // Max Price
  if (currentMaxPrice) {
    filtered = filtered.filter(a => a.price <= currentMaxPrice);
  }

  renderAccommodations(filtered);
}

function resetFilters() {
  currentFilter = 'all';
  currentGenderFilter = 'all';
  currentMaxPrice = 25000;
  searchQuery = '';

  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector('.filter-tab[data-filter="all"]')?.classList.add('active');

  const heroSearch = document.getElementById('heroSearchInput');
  if (heroSearch) heroSearch.value = '';
  const heroGender = document.getElementById('heroGenderSelect');
  if (heroGender) heroGender.value = 'all';
  const heroBudget = document.getElementById('heroBudgetSelect');
  if (heroBudget) heroBudget.value = 'all';

  renderAccommodations(accommodationsData);
}

// Setup Event Listeners
function setupEventListeners() {
  // Category tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Hero Search Form
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const searchInput = document.getElementById('heroSearchInput');
      const genderSelect = document.getElementById('heroGenderSelect');
      const budgetSelect = document.getElementById('heroBudgetSelect');

      searchQuery = searchInput ? searchInput.value : '';
      currentGenderFilter = genderSelect ? genderSelect.value : 'all';

      if (budgetSelect && budgetSelect.value !== 'all') {
        currentMaxPrice = parseInt(budgetSelect.value, 10);
      } else {
        currentMaxPrice = 50000;
      }

      applyFilters();

      // Smooth scroll down to accommodations
      const targetSection = document.getElementById('accommodations');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Contact Form Submission (Directed to sg9tradingplatform@gmail.com)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending Message...';
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        subject: document.getElementById('contactSubject').value.trim() || 'Accommodation Inquiry',
        message: document.getElementById('contactMessage').value.trim()
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
          showToast(`✓ Message sent to sg9tradingplatform@gmail.com!`, 'success');
          contactForm.reset();
        } else {
          showToast(data.error || 'Failed to send inquiry.', 'error');
        }
      } catch (err) {
        console.error('Contact submission error:', err);
        showToast('Network error while sending message.', 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Booking Form Submission
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Confirming Reservation...';
      submitBtn.disabled = true;

      const bookingPayload = {
        accommodationId: document.getElementById('bookAccommodationId').value,
        accommodationName: document.getElementById('bookAccommodationName').value,
        fullName: document.getElementById('bookFullName').value.trim(),
        email: document.getElementById('bookEmail').value.trim(),
        phone: document.getElementById('bookPhone').value.trim(),
        checkInDate: document.getElementById('bookDate').value,
        sharingPreference: document.getElementById('bookSharing').value,
        message: document.getElementById('bookNotes').value.trim()
      };

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        });

        const data = await res.json();
        if (res.ok) {
          closeModal('bookingModal');
          showToast(`🎉 Booking Scheduled! Reference: ${data.booking.id}`, 'success');
          bookingForm.reset();
        } else {
          showToast(data.error || 'Booking failed.', 'error');
        }
      } catch (err) {
        console.error('Booking submission error:', err);
        showToast('Network error while scheduling booking.', 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Open Accommodation Details Modal
function openDetailsModal(id) {
  const item = accommodationsData.find(a => a.id === id);
  if (!item) return;

  const modalBody = document.getElementById('detailsModalContent');
  if (!modalBody) return;

  const galleryImages = item.gallery && item.gallery.length ? item.gallery : [item.image];

  modalBody.innerHTML = `
    <div class="modal-gallery-main">
      <img id="mainModalImage" src="${galleryImages[0]}" alt="${item.name}" />
    </div>
    <div class="modal-thumbnails">
      ${galleryImages.map((imgUrl, idx) => `
        <div class="modal-thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchModalImage('${imgUrl}', this)">
          <img src="${imgUrl}" alt="Photo ${idx + 1}" />
        </div>
      `).join('')}
    </div>
    <div class="modal-content-body">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
        <div>
          <span class="card-badge-top" style="position: static; display: inline-flex; margin-bottom: 8px;">✦ ${item.badge || 'Verified'}</span>
          <h2 style="font-size: 1.8rem; line-height: 1.2;">${item.name}</h2>
          <p style="color: #64748b; font-weight: 500; font-size: 0.95rem;">${item.type} • Gender: <strong>${item.gender}</strong></p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase;">Monthly Rent</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #0F172A;">₹${item.price.toLocaleString()}<span style="font-size: 0.9rem; font-weight: 500; color: #64748B;">/mo</span></div>
          <div style="font-size: 0.8rem; color: #059669; font-weight: 600;">Refundable Deposit: ₹${item.deposit.toLocaleString()}</div>
        </div>
      </div>

      <div style="background: #F1F5F9; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.2rem;">📍</span>
          <span>Location: <strong style="color: #FF5A36;">${item.location || 'NA'}</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.1rem;">🛏️</span>
          <span>Available Beds: <strong>${item.availableBeds} remaining</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.1rem;">⭐</span>
          <span>Rating: <strong>${item.rating} / 5.0 (${item.reviewsCount} reviews)</strong></span>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 1.1rem; margin-bottom: 8px;">Overview & Experience</h4>
        <p style="color: #475569; line-height: 1.7; font-size: 0.95rem;">${item.description}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 1.1rem; margin-bottom: 12px;">Room & Living Specifications</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 10px;">
            <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Bed Setup</div>
            <div style="font-weight: 600; color: #0F172A;">${item.roomDetails.bed}</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 10px;">
            <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Washroom</div>
            <div style="font-weight: 600; color: #0F172A;">${item.roomDetails.bathroom}</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 10px;">
            <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Study Setup</div>
            <div style="font-weight: 600; color: #0F172A;">${item.roomDetails.workspace}</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 10px;">
            <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase;">Balcony View</div>
            <div style="font-weight: 600; color: #0F172A;">${item.roomDetails.balcony}</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h4 style="font-size: 1.1rem; margin-bottom: 12px;">Premium Amenities Included</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
          ${item.amenities.map(a => `
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #334155;">
              <span style="color: #10B981; font-weight: bold;">✓</span> ${a}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <button class="btn btn-outline" onclick="closeModal('detailsModal')">Close</button>
        <button class="btn btn-primary" onclick="closeModal('detailsModal'); openBookingModal('${item.id}');">Proceed to Schedule Visit</button>
      </div>
    </div>
  `;

  openModal('detailsModal');
}

function switchModalImage(url, thumbElement) {
  const mainImg = document.getElementById('mainModalImage');
  if (mainImg) mainImg.src = url;
  document.querySelectorAll('.modal-thumb-item').forEach(el => el.classList.remove('active'));
  if (thumbElement) thumbElement.classList.add('active');
}

// Open Booking Modal
function openBookingModal(accommodationId) {
  const item = accommodationsData.find(a => a.id === accommodationId);
  const titleEl = document.getElementById('bookingModalTitle');
  const idInput = document.getElementById('bookAccommodationId');
  const nameInput = document.getElementById('bookAccommodationName');

  if (item) {
    if (titleEl) titleEl.innerText = `Reserve & Visit: ${item.name}`;
    if (idInput) idInput.value = item.id;
    if (nameInput) nameInput.value = item.name;
  } else {
    if (titleEl) titleEl.innerText = `Schedule a Free Homies Visit`;
    if (idInput) idInput.value = 'general';
    if (nameInput) nameInput.value = 'Homies General Preference';
  }

  // Set default min check-in date to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  openModal('bookingModal');
}

// Open/Close Modal Utilities
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// FAQ Accordion
function setupFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Copy Email to Clipboard helper
function copyEmailAddress() {
  const email = 'sg9tradingplatform@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copied ${email} to clipboard!`, 'success');
  }).catch(() => {
    showToast(`Email: ${email}`, 'info');
  });
}

// Toast System
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeftColor = type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#FF5A36';
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Fetch Live Stats
async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    const stats = await res.json();
    const statBeds = document.getElementById('statAvailableBeds');
    if (statBeds && stats.availableBeds) statBeds.innerText = `${stats.availableBeds}+ Beds`;
  } catch (e) {
    // Non-blocking
  }
}

// Open Admin Inquiries Viewer
async function openAdminModal() {
  try {
    const [bookingsRes, inquiriesRes] = await Promise.all([
      fetch('/api/bookings'),
      fetch('/api/contact')
    ]);

    const bookings = await bookingsRes.json();
    const inquiries = await inquiriesRes.json();

    const adminContent = document.getElementById('adminModalContent');
    if (!adminContent) return;

    adminContent.innerHTML = `
      <div style="padding: 24px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 6px;">Live System Leads & Inquiries</h3>
        <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 24px;">Connected email channel: <strong>sg9tradingplatform@gmail.com</strong></p>

        <h4 style="margin-bottom: 12px; color: #FF5A36;">📅 Room Bookings & Visit Requests (${bookings.length})</h4>
        ${bookings.length === 0 ? '<p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px;">No bookings received yet. Submit a booking to test!</p>' : `
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
            ${bookings.map(b => `
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.95rem;">
                  <span>${b.fullName} (${b.phone})</span>
                  <span style="color: #10B981;">${b.status}</span>
                </div>
                <div style="font-size: 0.85rem; color: #475569; margin-top: 4px;">
                  Stay: <strong>${b.accommodationName}</strong> • Date: ${b.checkInDate} • Email: ${b.email}
                </div>
                ${b.message ? `<div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">Note: "${b.message}"</div>` : ''}
              </div>
            `).join('')}
          </div>
        `}

        <h4 style="margin-bottom: 12px; color: #4F46E5;">✉️ Direct Contact Inquiries (${inquiries.length})</h4>
        ${inquiries.length === 0 ? '<p style="color: #94a3b8; font-size: 0.9rem;">No messages sent yet. Use the Contact Us form to test!</p>' : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${inquiries.map(i => `
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.95rem;">
                  <span>${i.name} (${i.email})</span>
                  <span style="font-size: 0.75rem; color: #64748b;">${new Date(i.createdAt).toLocaleString()}</span>
                </div>
                <div style="font-size: 0.88rem; color: #1E293B; margin-top: 4px; font-weight: 600;">
                  Subject: ${i.subject}
                </div>
                <div style="font-size: 0.85rem; color: #475569; margin-top: 4px; background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                  "${i.message}"
                </div>
                <div style="font-size: 0.75rem; color: #10B981; margin-top: 4px;">
                  ✓ Routed to: ${i.recipientEmail}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    openModal('adminModal');
  } catch (err) {
    showToast('Failed to load inquiries.', 'error');
  }
}
