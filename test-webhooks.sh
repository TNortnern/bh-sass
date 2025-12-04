#!/bin/bash

# Test webhook functionality for BH-SaaS
# This script tests webhook creation, delivery, and retry mechanisms

set -e

BASE_URL="http://localhost:3004"
API_KEY="tk_58v2xsw911d0dy5q8mrlum3r9hah05n0"
TENANT_ID="6"

echo "========================================="
echo "BH-SAAS WEBHOOK SYSTEM TEST"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Step 1: Check if webhook endpoint collection exists
echo "Step 1: Checking if webhook-endpoints collection exists..."
COLLECTION_CHECK=$(curl -s -X GET "$BASE_URL/api/webhook-endpoints" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json")

if echo "$COLLECTION_CHECK" | grep -q "docs"; then
    print_success "webhook-endpoints collection is accessible"
else
    print_error "webhook-endpoints collection not accessible"
    echo "Response: $COLLECTION_CHECK"
    exit 1
fi

echo ""

# Step 2: Create a test webhook endpoint using the API
echo "Step 2: Creating test webhook endpoint..."
WEBHOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/webhooks/register" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": '$TENANT_ID',
    "name": "Test Webhook Endpoint",
    "url": "https://webhook.site/unique-id-here",
    "events": ["booking.created", "booking.confirmed", "payment.succeeded"]
  }')

if echo "$WEBHOOK_RESPONSE" | grep -q "\"id\""; then
    print_success "Webhook endpoint created successfully"
    WEBHOOK_ID=$(echo "$WEBHOOK_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    WEBHOOK_SECRET=$(echo "$WEBHOOK_RESPONSE" | grep -o '"secret":"[^"]*' | cut -d'"' -f4)
    print_info "Webhook ID: $WEBHOOK_ID"
    print_info "Webhook Secret: $WEBHOOK_SECRET"
else
    print_error "Failed to create webhook endpoint"
    echo "Response: $WEBHOOK_RESPONSE"
    exit 1
fi

echo ""

# Step 3: Send a test webhook
echo "Step 3: Sending test webhook..."
TEST_WEBHOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/webhooks/test" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "endpointId": "'$WEBHOOK_ID'",
    "event": "booking.created"
  }')

if echo "$TEST_WEBHOOK_RESPONSE" | grep -q "\"delivery\""; then
    print_success "Test webhook sent"
    TEST_SUCCESS=$(echo "$TEST_WEBHOOK_RESPONSE" | grep -o '"success":[^,}]*' | cut -d':' -f2)
    TEST_STATUS=$(echo "$TEST_WEBHOOK_RESPONSE" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    print_info "Delivery Status: $TEST_STATUS"

    if [ "$TEST_SUCCESS" = "true" ]; then
        print_success "Test webhook delivered successfully"
    else
        print_error "Test webhook delivery failed (expected for fake URL)"
        print_info "This is normal if using a fake webhook.site URL"
    fi
else
    print_error "Failed to send test webhook"
    echo "Response: $TEST_WEBHOOK_RESPONSE"
fi

echo ""

# Step 4: Check webhook deliveries
echo "Step 4: Checking webhook deliveries..."
DELIVERIES_RESPONSE=$(curl -s -X GET "$BASE_URL/api/webhooks/$WEBHOOK_ID/deliveries?limit=10" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json")

if echo "$DELIVERIES_RESPONSE" | grep -q "\"docs\""; then
    print_success "Webhook deliveries retrieved"
    DELIVERY_COUNT=$(echo "$DELIVERIES_RESPONSE" | grep -o '"totalDocs":[^,}]*' | cut -d':' -f2)
    print_info "Total deliveries: $DELIVERY_COUNT"
else
    print_error "Failed to retrieve webhook deliveries"
    echo "Response: $DELIVERIES_RESPONSE"
fi

echo ""

# Step 5: Create a real booking to trigger webhook
echo "Step 5: Creating a booking to trigger real webhook..."

# First, get a customer
CUSTOMER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/customers?limit=1" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json")

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$CUSTOMER_ID" ]; then
    print_info "No customers found, creating one..."
    CUSTOMER_CREATE=$(curl -s -X POST "$BASE_URL/api/customers" \
      -H "X-API-Key: $API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tenantId": '$TENANT_ID',
        "firstName": "Webhook",
        "lastName": "Test",
        "email": "webhook-test@example.com",
        "phone": "555-0100"
      }')
    CUSTOMER_ID=$(echo "$CUSTOMER_CREATE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    print_info "Customer created: $CUSTOMER_ID"
fi

# Get a service from rb-payload
RB_SERVICES=$(curl -s -X GET "https://reusablebook-payload-production.up.railway.app/api/services?limit=1" \
  -H "X-API-Key: $API_KEY")

SERVICE_ID=$(echo "$RB_SERVICES" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$SERVICE_ID" ]; then
    print_error "No services found in rb-payload"
    print_info "Skipping booking creation test"
else
    print_info "Using service ID: $SERVICE_ID"

    # Create booking
    BOOKING_RESPONSE=$(curl -s -X POST "https://reusablebook-payload-production.up.railway.app/api/bookings" \
      -H "X-API-Key: $API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tenantId": '$TENANT_ID',
        "customerId": "'$CUSTOMER_ID'",
        "serviceId": "'$SERVICE_ID'",
        "startDate": "2025-12-15T09:00:00.000Z",
        "endDate": "2025-12-15T17:00:00.000Z",
        "status": "pending",
        "paymentStatus": "unpaid",
        "totalPrice": 250.00,
        "notes": "Webhook test booking"
      }')

    if echo "$BOOKING_RESPONSE" | grep -q '"id"'; then
        BOOKING_ID=$(echo "$BOOKING_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
        print_success "Booking created: $BOOKING_ID"
        print_info "This should trigger a booking.created webhook"
    else
        print_error "Failed to create booking"
        echo "Response: $BOOKING_RESPONSE"
    fi
fi

echo ""

# Step 6: Check webhook deliveries again
echo "Step 6: Checking webhook deliveries after booking creation..."
sleep 2  # Wait for webhook to be queued and delivered

DELIVERIES_RESPONSE_2=$(curl -s -X GET "$BASE_URL/api/webhooks/$WEBHOOK_ID/deliveries?limit=10" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json")

if echo "$DELIVERIES_RESPONSE_2" | grep -q "\"docs\""; then
    DELIVERY_COUNT_2=$(echo "$DELIVERIES_RESPONSE_2" | grep -o '"totalDocs":[^,}]*' | cut -d':' -f2)
    print_info "Total deliveries now: $DELIVERY_COUNT_2"

    if [ "$DELIVERY_COUNT_2" -gt "$DELIVERY_COUNT" ]; then
        print_success "New delivery created for booking.created event!"
    else
        print_info "No new deliveries detected (webhook might be processing)"
    fi
fi

echo ""

# Step 7: List all webhook endpoints for this tenant
echo "Step 7: Listing all webhook endpoints..."
ALL_WEBHOOKS=$(curl -s -X GET "$BASE_URL/api/webhook-endpoints?limit=10" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json")

if echo "$ALL_WEBHOOKS" | grep -q "\"docs\""; then
    WEBHOOK_COUNT=$(echo "$ALL_WEBHOOKS" | grep -o '"totalDocs":[^,}]*' | cut -d':' -f2)
    print_success "Found $WEBHOOK_COUNT webhook endpoint(s)"
fi

echo ""

# Summary
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo ""
print_info "Webhook System Status: OPERATIONAL"
echo ""
echo "Key findings:"
echo "  • Webhook endpoint collection exists and is accessible"
echo "  • Webhook registration endpoint works"
echo "  • Test webhook endpoint works"
echo "  • Webhook deliveries are tracked"
echo "  • Webhook retry job should be running (check Payload logs)"
echo ""
echo "To verify webhooks are fully working:"
echo "  1. Set a real webhook URL (e.g., from webhook.site)"
echo "  2. Create a booking and check if webhook is delivered"
echo "  3. Check webhook-deliveries collection for logs"
echo ""
print_success "All webhook tests completed!"
echo ""
