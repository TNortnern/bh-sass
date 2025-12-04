#!/bin/bash

# Test script for real-time notifications
# Usage: ./test-notifications.sh

echo "======================================"
echo "Real-time Notifications Test"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Testing SSE Endpoint${NC}"
echo "Checking if SSE endpoint is accessible..."
echo ""

# Test SSE endpoint (should hang, that's ok - we'll kill it after 2 seconds)
timeout 2 curl -N http://localhost:3005/sse/notifications?tenantId=6 2>/dev/null || true
echo ""

if [ $? -eq 124 ]; then
  echo -e "${GREEN}✓ SSE endpoint is responding${NC}"
else
  echo -e "${RED}✗ SSE endpoint not accessible${NC}"
fi
echo ""

echo -e "${YELLOW}Step 2: Testing Broadcast Endpoint${NC}"
echo "Sending test notification broadcast..."
echo ""

# Send test notification
RESPONSE=$(curl -s -X POST http://localhost:3005/api/sse/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": 6,
    "notification": {
      "id": 9999,
      "type": "booking_created",
      "title": "Test Notification",
      "body": "This is a test notification from the test script",
      "read": false,
      "link": "/app/bookings",
      "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"
    }
  }')

echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "success"; then
  echo -e "${GREEN}✓ Broadcast endpoint working${NC}"
else
  echo -e "${RED}✗ Broadcast endpoint failed${NC}"
  echo "Response: $RESPONSE"
fi
echo ""

echo -e "${YELLOW}Step 3: Manual Testing Instructions${NC}"
echo ""
echo "To test the full notification flow:"
echo ""
echo "1. Open dashboard in browser:"
echo "   ${GREEN}http://localhost:3005/app${NC}"
echo ""
echo "2. Check browser console for connection logs:"
echo "   - 'Connecting to notification stream for tenant 6'"
echo "   - 'Connected to notification stream'"
echo "   - 'SSE connection confirmed'"
echo ""
echo "3. Check for green dot on notification bell (top-right)"
echo ""
echo "4. Create a test booking:"
echo ""
echo "   Option A - Via rb-payload API:"
echo "   ${GREEN}curl -X POST https://reusablebook-payload-production.up.railway.app/api/bookings \\${NC}"
echo "   ${GREEN}  -H 'Content-Type: application/json' \\${NC}"
echo "   ${GREEN}  -H 'X-API-Key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0' \\${NC}"
echo "   ${GREEN}  -d '{${NC}"
echo "   ${GREEN}    \"tenantId\": 6,${NC}"
echo "   ${GREEN}    \"customerId\": 1,${NC}"
echo "   ${GREEN}    \"items\": [{\"serviceId\": 1, \"quantity\": 1}],${NC}"
echo "   ${GREEN}    \"startTime\": \"2025-12-15T10:00:00.000Z\",${NC}"
echo "   ${GREEN}    \"endTime\": \"2025-12-15T14:00:00.000Z\",${NC}"
echo "   ${GREEN}    \"status\": \"pending\"${NC}"
echo "   ${GREEN}  }'${NC}"
echo ""
echo "   Option B - Via rb-payload Admin UI:"
echo "   ${GREEN}https://reusablebook-payload-production.up.railway.app/admin${NC}"
echo "   Login and create a booking manually"
echo ""
echo "5. Watch dashboard for:"
echo "   - Toast notification appearing (top-right corner)"
echo "   - Bell badge count incrementing"
echo "   - Notification appearing in dropdown"
echo "   - Browser console showing 'Received notification'"
echo ""
echo "======================================"
echo -e "${GREEN}Test Complete!${NC}"
echo "======================================"
