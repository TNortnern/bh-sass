#!/bin/bash

BASE_URL="http://localhost:3004"

echo "=== Testing Payload CMS Booking Creation ==="
echo

# Step 1: Login
echo "1. Logging in as admin@bouncepro.demo..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "${BASE_URL}/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bouncepro.demo",
    "password": "demo123!"
  }')

echo "Login response: ${LOGIN_RESPONSE}" | jq '.user.email, .user.role' 2>/dev/null || echo "${LOGIN_RESPONSE}"
echo

# Step 2: Check current user
echo "2. Checking current user..."
USER_RESPONSE=$(curl -s -b cookies.txt "${BASE_URL}/api/users/me")
echo "User response: ${USER_RESPONSE}" | jq '.user.email' 2>/dev/null || echo "${USER_RESPONSE}"
echo

# Step 3: Get bookings
echo "3. Fetching bookings..."
BOOKINGS_RESPONSE=$(curl -s -b cookies.txt "${BASE_URL}/api/bookings")
echo "Bookings count: $(echo ${BOOKINGS_RESPONSE} | jq '.totalDocs' 2>/dev/null)"
echo

# Cleanup
rm -f cookies.txt

echo "=== Test Complete ==="
