#!/bin/bash

echo "========================================="
echo "Auth Persistence Test"
echo "========================================="
echo ""

echo "Step 1: Checking if Payload is running..."
curl -s http://localhost:3004/api/platform-settings/public > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Payload is responding"
else
    echo "✗ Payload is not responding"
    exit 1
fi
echo ""

echo "Step 2: Login test..."
LOGIN_RESPONSE=$(curl -s -c /tmp/cookies.txt -X POST http://localhost:3005/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✓ Login successful"
else
    echo "✗ Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

echo "Step 3: Checking cookie was set..."
if grep -q "payload-token" /tmp/cookies.txt; then
    echo "✓ Cookie was set"
    cat /tmp/cookies.txt | grep "payload-token"
else
    echo "✗ No cookie found"
    exit 1
fi
echo ""

echo "Step 4: Verifying session with /users/me..."
ME_RESPONSE=$(curl -s -b /tmp/cookies.txt http://localhost:3005/v1/users/me)

if echo "$ME_RESPONSE" | grep -q "email"; then
    echo "✓ Session is valid"
    echo "User: $(echo $ME_RESPONSE | grep -o '"email":"[^"]*"')"
else
    echo "✗ Session is invalid"
    echo "Response: $ME_RESPONSE"
    exit 1
fi
echo ""

echo "Step 5: Restarting Payload container..."
docker compose restart payload > /dev/null 2>&1
echo "Waiting for Payload to restart (10 seconds)..."
sleep 10
echo ""

echo "Step 6: Verifying session after restart..."
ME_RESPONSE_AFTER=$(curl -s -b /tmp/cookies.txt http://localhost:3005/v1/users/me)

if echo "$ME_RESPONSE_AFTER" | grep -q "email"; then
    echo "✓ Session persisted after restart!"
    echo "User: $(echo $ME_RESPONSE_AFTER | grep -o '"email":"[^"]*"')"
else
    echo "✗ Session was lost after restart"
    echo "Response: $ME_RESPONSE_AFTER"
    exit 1
fi
echo ""

echo "========================================="
echo "✓ All tests passed!"
echo "Auth persistence is working correctly."
echo "========================================="

# Cleanup
rm -f /tmp/cookies.txt
