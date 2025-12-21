#!/bin/bash

BASE_URL="http://localhost:3004"

echo "=== Testing Payload CMS Booking Creation ==="
echo

# Step 1: Login
echo "1. Logging in as admin@bouncepro.demo..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bouncepro.demo",
    "password": "password123",
    "rememberMe": true
  }')

echo "Login response: ${LOGIN_RESPONSE}" | jq '.' 2>/dev/null || echo "${LOGIN_RESPONSE}"
echo

# Step 2: Check current user
echo "2. Checking current user..."
USER_RESPONSE=$(curl -s -b cookies.txt "${BASE_URL}/api/users/me")
echo "User response: ${USER_RESPONSE}" | jq '.' 2>/dev/null || echo "${USER_RESPONSE}"
echo

# Step 3: Get customers
echo "3. Fetching customers..."
CUSTOMERS_RESPONSE=$(curl -s -b cookies.txt "${BASE_URL}/api/customers")
echo "Customers response: ${CUSTOMERS_RESPONSE}" | jq '.docs[] | {id, name, email}' 2>/dev/null || echo "${CUSTOMERS_RESPONSE}"
echo

# Step 4: Get rental items
echo "4. Fetching rental items..."
ITEMS_RESPONSE=$(curl -s -b cookies.txt "${BASE_URL}/api/rental-items")
echo "Rental items response: ${ITEMS_RESPONSE}" | jq '.docs[] | {id, name, pricing}' 2>/dev/null || echo "${ITEMS_RESPONSE}"
echo

# Step 5: Try to create a booking
echo "5. Creating a test booking..."
BOOKING_RESPONSE=$(curl -s -b cookies.txt -X POST "${BASE_URL}/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": 6,
    "rentalItemId": 16,
    "customerId": 7,
    "startDate": "2025-12-15T10:00:00.000Z",
    "endDate": "2025-12-15T18:00:00.000Z",
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "Austin",
      "state": "TX",
      "zipCode": "78701"
    },
    "status": "pending",
    "totalPrice": 250,
    "depositPaid": 125,
    "paymentStatus": "deposit_paid"
  }')

echo "Booking response: ${BOOKING_RESPONSE}" | jq '.' 2>/dev/null || echo "${BOOKING_RESPONSE}"
echo

# Cleanup
rm -f cookies.txt

echo "=== Test Complete ==="
