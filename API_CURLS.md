# Astro Backend API Endpoints - cURL Commands

This file contains all the cURL commands to test the Astro Backend API endpoints.

**Base URL:** `http://localhost:8000/api/v1`

---

## 🏥 Health Check

### Check API Health
```bash
curl -s "http://localhost:8000/api/v1/health" | python3 -m json.tool
```

---

## 🔮 Horoscope Endpoints

### Get Daily Horoscope for Specific Raashi
```bash
# Mesh (Aries)
curl -s "http://localhost:8000/api/v1/horoscope/daily/mesh" | python3 -m json.tool

# Vrishabh (Taurus)
curl -s "http://localhost:8000/api/v1/horoscope/daily/vrishabh" | python3 -m json.tool

# Mithun (Gemini)
curl -s "http://localhost:8000/api/v1/horoscope/daily/mithun" | python3 -m json.tool

# Kark (Cancer)
curl -s "http://localhost:8000/api/v1/horoscope/daily/kark" | python3 -m json.tool

# Singh (Leo)
curl -s "http://localhost:8000/api/v1/horoscope/daily/singh" | python3 -m json.tool

# Kanya (Virgo)
curl -s "http://localhost:8000/api/v1/horoscope/daily/kanya" | python3 -m json.tool

# Tula (Libra)
curl -s "http://localhost:8000/api/v1/horoscope/daily/tula" | python3 -m json.tool

# Vrishchik (Scorpio)
curl -s "http://localhost:8000/api/v1/horoscope/daily/vrishchik" | python3 -m json.tool

# Dhanu (Sagittarius)
curl -s "http://localhost:8000/api/v1/horoscope/daily/dhanu" | python3 -m json.tool

# Makar (Capricorn)
curl -s "http://localhost:8000/api/v1/horoscope/daily/makar" | python3 -m json.tool

# Kumbh (Aquarius)
curl -s "http://localhost:8000/api/v1/horoscope/daily/kumbh" | python3 -m json.tool

# Meen (Pisces)
curl -s "http://localhost:8000/api/v1/horoscope/daily/meen" | python3 -m json.tool
```

### Get Daily Horoscope with Specific Date
```bash
curl -s "http://localhost:8000/api/v1/horoscope/daily/mesh?date=2024-08-31" | python3 -m json.tool
```

### Get Horoscope for All Signs
```bash
curl -s "http://localhost:8000/api/v1/horoscope/daily" | python3 -m json.tool
```

### Get Weekly Horoscope
```bash
curl -s "http://localhost:8000/api/v1/horoscope/weekly/mesh" | python3 -m json.tool

# With start date
curl -s "http://localhost:8000/api/v1/horoscope/weekly/mesh?startDate=2024-08-31" | python3 -m json.tool
```

### Get Current Panchang
```bash
curl -s "http://localhost:8000/api/v1/horoscope/panchang" | python3 -m json.tool

# With specific date
curl -s "http://localhost:8000/api/v1/horoscope/panchang?date=2024-08-31" | python3 -m json.tool
```

### Get Current Nakshatra Info
```bash
curl -s "http://localhost:8000/api/v1/horoscope/nakshatra" | python3 -m json.tool

# With specific date
curl -s "http://localhost:8000/api/v1/horoscope/nakshatra?date=2024-08-31" | python3 -m json.tool
```

### Get Planetary Positions
```bash
curl -s "http://localhost:8000/api/v1/horoscope/planets" | python3 -m json.tool

# With specific date
curl -s "http://localhost:8000/api/v1/horoscope/planets?date=2024-08-31" | python3 -m json.tool
```

### Get Horoscope for Chat/Bot
```bash
# Overall horoscope
curl -s "http://localhost:8000/api/v1/horoscope/chat/mesh/overall" | python3 -m json.tool

# Love aspect
curl -s "http://localhost:8000/api/v1/horoscope/chat/mesh/love" | python3 -m json.tool

# Career aspect
curl -s "http://localhost:8000/api/v1/horoscope/chat/mesh/career" | python3 -m json.tool

# Health aspect
curl -s "http://localhost:8000/api/v1/horoscope/chat/mesh/health" | python3 -m json.tool

# Finance aspect
curl -s "http://localhost:8000/api/v1/horoscope/chat/mesh/finance" | python3 -m json.tool
```

### Get Lucky Elements
```bash
curl -s "http://localhost:8000/api/v1/horoscope/lucky/mesh" | python3 -m json.tool
```

---

## 🧬 Enhanced Horoscope Endpoints (Personalized System)

### Get Personalized Horoscope
```bash
curl -X POST "http://localhost:8000/api/v1/enhanced/personalized-horoscope" \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1995-05-15",
    "birthTime": "14:30",
    "birthPlace": "Mumbai, India",
    "zodiacSign": "vrishabh"
  }' | python3 -m json.tool
```

### Create Birth Chart
```bash
curl -X POST "http://localhost:8000/api/v1/enhanced/birth-chart" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "birthDate": "1995-05-15",
    "birthTime": "14:30",
    "birthPlace": "Mumbai, India",
    "birthCountry": "India",
    "gender": "male",
    "notes": "Test birth chart"
  }' | python3 -m json.tool
```

### Get Birth Chart by ID
```bash
# Replace {chartId} with actual chart ID
curl -s "http://localhost:8000/api/v1/enhanced/birth-chart/{chartId}" | python3 -m json.tool
```

### Get User Birth Charts
```bash
curl -s "http://localhost:8000/api/v1/enhanced/birth-charts/user@example.com" | python3 -m json.tool
```

### Check Compatibility
```bash
curl -X POST "http://localhost:8000/api/v1/enhanced/compatibility" \
  -H "Content-Type: application/json" \
  -d '{
    "person1": {
      "name": "Rahul",
      "birthDate": "1995-05-15",
      "birthTime": "14:30",
      "birthPlace": "Mumbai, India"
    },
    "person2": {
      "name": "Priya",
      "birthDate": "1996-08-22",
      "birthTime": "09:15",
      "birthPlace": "Delhi, India"
    }
  }' | python3 -m json.tool
```

### Compare Horoscope Accuracy
```bash
curl -X POST "http://localhost:8000/api/v1/enhanced/compare-accuracy" \
  -H "Content-Type: application/json" \
  -d '{
    "zodiacSign": "mesh",
    "birthData": {
      "birthDate": "1995-05-15",
      "birthTime": "14:30",
      "birthPlace": "Mumbai, India"
    }
  }' | python3 -m json.tool
```

---

## 👥 Persona Endpoints

### Get All Personas
```bash
curl -s "http://localhost:8000/api/v1/personas" | python3 -m json.tool
```

### Get Specific Persona by Slug
```bash
# Traditional Persona
curl -s "http://localhost:8000/api/v1/personas/sanatan-vision" | python3 -m json.tool

# Modern Persona
curl -s "http://localhost:8000/api/v1/personas/cosmic-didi" | python3 -m json.tool

# Tantric Persona
curl -s "http://localhost:8000/api/v1/personas/tantrik-master" | python3 -m json.tool

# Love Guru Persona
curl -s "http://localhost:8000/api/v1/personas/love-guru-priya" | python3 -m json.tool
```

### Get Default Persona
```bash
curl -s "http://localhost:8000/api/v1/personas/default" | python3 -m json.tool
```

### Search Personas by Category
```bash
# Traditional
curl -s "http://localhost:8000/api/v1/personas?category=traditional" | python3 -m json.tool

# Modern
curl -s "http://localhost:8000/api/v1/personas?category=modern" | python3 -m json.tool

# Tantric
curl -s "http://localhost:8000/api/v1/personas?category=tantric" | python3 -m json.tool

# Romantic
curl -s "http://localhost:8000/api/v1/personas?category=romantic" | python3 -m json.tool
```

### Update Persona Usage Stats
```bash
curl -X POST "http://localhost:8000/api/v1/personas/sanatan-vision/usage" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionDuration": 25,
    "messagesExchanged": 8,
    "userRating": 5
  }' | python3 -m json.tool
```

---

## 📝 Review Endpoints

### Get Reviews for Persona
```bash
curl -s "http://localhost:8000/api/v1/reviews/persona/sanatan-vision" | python3 -m json.tool

# With pagination
curl -s "http://localhost:8000/api/v1/reviews/persona/sanatan-vision?page=1&limit=5" | python3 -m json.tool

# With rating filter
curl -s "http://localhost:8000/api/v1/reviews/persona/sanatan-vision?rating=5" | python3 -m json.tool
```

### Get Review Statistics
```bash
curl -s "http://localhost:8000/api/v1/reviews/persona/sanatan-vision/stats" | python3 -m json.tool
```

### Get Featured Reviews
```bash
curl -s "http://localhost:8000/api/v1/reviews/featured" | python3 -m json.tool

# For specific persona
curl -s "http://localhost:8000/api/v1/reviews/featured?persona=sanatan-vision" | python3 -m json.tool
```

### Create New Review
```bash
curl -X POST "http://localhost:8000/api/v1/reviews/persona/cosmic-didi" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Neha Gupta",
    "rating": 5,
    "title": "Amazing experience!",
    "comment": "Priya didi ne bahut achhi guidance di! Her modern approach was exactly what I needed.",
    "aspects": {
      "accuracy": 5,
      "helpfulness": 5,
      "communication": 4,
      "personality": 5
    },
    "sessionDuration": 20,
    "messagesExchanged": 10,
    "language": "hinglish",
    "platform": "web",
    "tags": ["modern", "helpful", "guidance"]
  }' | python3 -m json.tool
```

### Vote Review as Helpful
```bash
# Replace {reviewId} with actual review ID
curl -X POST "http://localhost:8000/api/v1/reviews/{reviewId}/helpful" | python3 -m json.tool
```

### Get Overall Review Analytics
```bash
curl -s "http://localhost:8000/api/v1/reviews/analytics" | python3 -m json.tool

# With date range
curl -s "http://localhost:8000/api/v1/reviews/analytics?startDate=2024-08-01&endDate=2024-08-31" | python3 -m json.tool
```

---

## 🌟 Astro General Endpoints

### Get Astro Chat Response
```bash
curl -X POST "http://localhost:8000/api/v1/astro/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is my horoscope for today?",
    "persona": "sanatan-vision",
    "userContext": {
      "name": "Rahul",
      "zodiacSign": "mesh"
    }
  }' | python3 -m json.tool
```

---

## 🧪 Testing Commands

### Run All Seed Scripts
```bash
# Seed personas
npm run seed:personas

# Seed reviews
npm run seed:reviews
```

### Test Database Connection
```bash
npm run db:connect
```

### Test Horoscope System
```bash
npm run test:horoscope
```

### Test Enhanced System
```bash
npm run test:enhanced
```

---

## 🚀 Server Management

### Start Server
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Check Server Status
```bash
curl -s "http://localhost:8000/api/v1/health"
```

---

## 📊 Quick Test Suite

### Run Multiple Tests at Once
```bash
# Test all main endpoints
echo "Testing Health..."
curl -s "http://localhost:8000/api/v1/health" | python3 -m json.tool

echo -e "\n\nTesting Daily Horoscope..."
curl -s "http://localhost:8000/api/v1/horoscope/daily/mesh" | python3 -m json.tool

echo -e "\n\nTesting Personas..."
curl -s "http://localhost:8000/api/v1/personas" | python3 -m json.tool

echo -e "\n\nTesting Reviews..."
curl -s "http://localhost:8000/api/v1/reviews/persona/sanatan-vision" | python3 -m json.tool

echo -e "\n\nAll tests completed!"
```

---

## 🔧 Troubleshooting

### Check Port Usage
```bash
lsof -ti:8000
```

### Kill Process on Port 8000
```bash
pkill -f "node src/index.js"
```

### Restart Server
```bash
pkill -f "node src/index.js" && npm start
```

---

## 📝 Notes

- All endpoints return JSON responses
- Use `python3 -m json.tool` to format JSON output for better readability
- Replace `{chartId}` and `{reviewId}` with actual IDs from your database
- Server must be running on localhost:8000 for these commands to work
- Database connection is automatically established when server starts

---

**🌟 Happy Testing! 🌟**
