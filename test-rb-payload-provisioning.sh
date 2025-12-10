#!/bin/bash
# Test rb-payload Automatic Tenant Provisioning
# Run this script to test the auto-provisioning feature

set -e  # Exit on error

echo "🧪 Testing rb-payload Automatic Tenant Provisioning"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BH_SAAS_URL="http://localhost:3004"
RB_PAYLOAD_URL="${RB_PAYLOAD_URL:-https://reusablebook-payload-production.up.railway.app}"

# Generate random test data
TIMESTAMP=$(date +%s)
BUSINESS_NAME="Test Rentals ${TIMESTAMP}"
EMAIL="test${TIMESTAMP}@example.com"
PASSWORD="SecurePass123!"

echo "Test Data:"
echo "  Business: ${BUSINESS_NAME}"
echo "  Email: ${EMAIL}"
echo ""

# Step 1: Check if services are running
echo "Step 1: Checking if services are running..."
if ! curl -s -f "${BH_SAAS_URL}/api" > /dev/null; then
  echo -e "${RED}✗ BH-SaaS is not accessible at ${BH_SAAS_URL}${NC}"
  echo "  Run: docker compose up -d"
  exit 1
fi
echo -e "${GREEN}✓ BH-SaaS is running${NC}"

if ! curl -s -f "${RB_PAYLOAD_URL}/api" > /dev/null; then
  echo -e "${YELLOW}⚠ rb-payload is not accessible at ${RB_PAYLOAD_URL}${NC}"
  echo "  Provisioning will fail but tenant will still be created"
fi
echo ""

# Step 2: Register new tenant
echo "Step 2: Registering new tenant..."
REGISTER_RESPONSE=$(curl -s -X POST "${BH_SAAS_URL}/api/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\",
    \"businessName\": \"${BUSINESS_NAME}\"
  }")

# Check if registration succeeded
if echo "${REGISTER_RESPONSE}" | grep -q '"message":"Registration successful"'; then
  echo -e "${GREEN}✓ Tenant registered successfully${NC}"
else
  echo -e "${RED}✗ Registration failed${NC}"
  echo "Response: ${REGISTER_RESPONSE}"
  exit 1
fi

# Extract tenant ID
TENANT_ID=$(echo "${REGISTER_RESPONSE}" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "  Tenant ID: ${TENANT_ID}"
echo ""

# Step 3: Check rb-payload provisioning status
echo "Step 3: Checking rb-payload provisioning status..."
echo "  (Waiting 3 seconds for provisioning to complete...)"
sleep 3

# Get tenant details (need to extract token first)
TOKEN=$(echo "${REGISTER_RESPONSE}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

TENANT_DETAILS=$(curl -s "${BH_SAAS_URL}/api/tenants/${TENANT_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

# Check provisioning status
RB_PAYLOAD_STATUS=$(echo "${TENANT_DETAILS}" | grep -o '"rbPayloadSyncStatus":"[^"]*"' | cut -d'"' -f4)
RB_PAYLOAD_TENANT_ID=$(echo "${TENANT_DETAILS}" | grep -o '"rbPayloadTenantId":[0-9]*' | grep -o '[0-9]*')
RB_PAYLOAD_API_KEY=$(echo "${TENANT_DETAILS}" | grep -o '"rbPayloadApiKey":"[^"]*"' | cut -d'"' -f4)

echo "  Sync Status: ${RB_PAYLOAD_STATUS}"

if [ "${RB_PAYLOAD_STATUS}" = "provisioned" ]; then
  echo -e "${GREEN}✓ Provisioned successfully${NC}"
  echo "  rb-payload Tenant ID: ${RB_PAYLOAD_TENANT_ID}"
  echo "  rb-payload API Key: ${RB_PAYLOAD_API_KEY:0:15}... (redacted)"

  # Step 4: Verify in rb-payload
  echo ""
  echo "Step 4: Verifying tenant in rb-payload..."

  # Try to fetch the tenant from rb-payload
  RB_TENANT=$(curl -s "${RB_PAYLOAD_URL}/api/tenants/${RB_PAYLOAD_TENANT_ID}" \
    -H "X-API-Key: ${RB_PAYLOAD_API_KEY}")

  if echo "${RB_TENANT}" | grep -q "\"name\":\"${BUSINESS_NAME}\""; then
    echo -e "${GREEN}✓ Tenant verified in rb-payload${NC}"

    # Check settings
    if echo "${RB_TENANT}" | grep -q '"availabilityMode":"inventory"'; then
      echo -e "${GREEN}✓ Inventory mode configured${NC}"
    else
      echo -e "${RED}✗ Inventory mode NOT configured${NC}"
    fi

    if echo "${RB_TENANT}" | grep -q '"customerSelectsStaff":"hidden"'; then
      echo -e "${GREEN}✓ Staff selection hidden${NC}"
    else
      echo -e "${RED}✗ Staff selection NOT hidden${NC}"
    fi
  else
    echo -e "${RED}✗ Tenant not found in rb-payload${NC}"
    echo "Response: ${RB_TENANT}"
  fi

elif [ "${RB_PAYLOAD_STATUS}" = "failed" ]; then
  echo -e "${RED}✗ Provisioning failed${NC}"
  ERROR=$(echo "${TENANT_DETAILS}" | grep -o '"rbPayloadSyncError":"[^"]*"' | cut -d'"' -f4)
  echo "  Error: ${ERROR}"

elif [ "${RB_PAYLOAD_STATUS}" = "pending" ]; then
  echo -e "${YELLOW}⚠ Provisioning still pending${NC}"
  echo "  rb-payload may not be configured or hook didn't run"

else
  echo -e "${YELLOW}⚠ Unknown status: ${RB_PAYLOAD_STATUS}${NC}"
fi

echo ""
echo "=================================================="
echo "🏁 Test Complete"
echo ""
echo "Summary:"
echo "  BH-SaaS Tenant ID: ${TENANT_ID}"
echo "  rb-payload Tenant ID: ${RB_PAYLOAD_TENANT_ID:-N/A}"
echo "  Provisioning Status: ${RB_PAYLOAD_STATUS}"
echo ""
echo "Next Steps:"
echo "  1. Check logs: docker compose logs -f payload | grep 'rb-payload'"
echo "  2. View tenant in admin: ${BH_SAAS_URL}/admin/collections/tenants/${TENANT_ID}"
echo "  3. View in rb-payload: ${RB_PAYLOAD_URL}/admin/collections/tenants/${RB_PAYLOAD_TENANT_ID}"
echo ""
