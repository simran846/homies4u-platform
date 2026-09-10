$booking = @{
  accommodationId = 'h4u-001'
  accommodationName = 'Homies Grand Villa'
  fullName = 'Aryan Gupta'
  email = 'aryan@example.com'
  phone = '+91 9876543210'
  checkInDate = '2026-09-15'
  sharingPreference = 'Private Single'
  message = 'Interested in single studio room'
} | ConvertTo-Json

$bookingRes = Invoke-RestMethod -Uri 'http://localhost:5000/api/bookings' -Method POST -Body $booking -ContentType 'application/json'
Write-Host "Booking Result:" ($bookingRes | ConvertTo-Json)

$contact = @{
  name = 'Rohan Verma'
  email = 'rohan@example.com'
  subject = 'Inquiry for October semester'
  message = 'Looking for high-speed Wi-Fi and twin sharing room.'
} | ConvertTo-Json

$contactRes = Invoke-RestMethod -Uri 'http://localhost:5000/api/contact' -Method POST -Body $contact -ContentType 'application/json'
Write-Host "Contact Result:" ($contactRes | ConvertTo-Json)
