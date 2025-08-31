# Daily Horoscope System Documentation 🌟

Complete Vedic Astrology Daily Horoscope system with Panchang, Nakshatra calculations, and multi-persona integration.

## 🎯 Features Overview

### ✨ Core Features
- **Daily Horoscope**: All 12 Vedic zodiac signs support
- **Weekly Horoscope**: 7-day predictions for any raashi
- **Panchang Calculator**: Complete Hindu calendar with Tithi, Nakshatra, Yoga, Karana
- **Planetary Positions**: Current graha positions and retrograde status
- **Lucky Elements**: Numbers, colors, gemstones, directions
- **Remedies System**: Personalized mantras and solutions
- **Multi-Persona Integration**: Different astrology expert personalities

### 🎭 Persona Integration
Each persona provides horoscope in their unique style:
- **Traditional**: Classical Vedic approach with Sanskrit terms
- **Modern**: Contemporary style with trendy expressions  
- **Tantric**: Mystical approach with powerful remedies
- **Romantic**: Love-focused predictions with caring tone

## 🔧 API Endpoints

### 📅 Daily Horoscope

#### Get Single Raashi Horoscope
```http
GET /api/v1/horoscope/daily/{raashi}?date=YYYY-MM-DD

# Examples:
GET /api/v1/horoscope/daily/mesh
GET /api/v1/horoscope/daily/simha?date=2024-08-31
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "date": "31/08/2024",
    "weekday": "शनिवार",
    "raashi": "Mesh (Aries)",
    "emoji": "♈",
    "panchang": {
      "tithi": "द्वितीया",
      "nakshatra": "अश्विनी",
      "yoga": "विष्कुम्भ",
      "karana": "बव"
    },
    "predictions": {
      "overall": "आज आपका दिन बहुत शुभ है! सभी क्षेत्रों में सफलता मिलेगी ✨",
      "love": "आज प्रेम के मामले में आपका दिन शानदार रहेगा! शुक्र आपके साथ है 💕",
      "career": "करियर में बड़ी सफलता मिल सकती है! गुरु ग्रह आपके साथ है 🚀",
      "health": "स्वास्थ्य बेहतरीन रहेगा! ऊर्जा से भरपूर दिन होगा 💪",
      "finance": "धन लाभ के योग हैं! लक्ष्मी जी की कृपा रहेगी 💰"
    },
    "luckyElements": {
      "numbers": [1, 8, 17],
      "colors": ["लाल", "नारंगी"],
      "direction": "उत्तर",
      "time": "प्रातः 6-8 बजे",
      "deity": "हनुमान जी"
    },
    "remedies": {
      "planetary": ["सूर्योदय के समय सूर्य को जल अर्पित करें"],
      "general": ["सुबह उठकर सूर्य नमस्कार करें"],
      "gemstone": "मूंगा धारण करना शुभ रहेगा",
      "color": "आज लाल रंग पहनना फायदेमंद होगा"
    },
    "mantra": "ॐ अं अनगाराय नमः",
    "auspiciousTime": "प्रातः 6-8 बजे",
    "warning": "आज राहु काल में कोई नया काम शुरू न करें"
  },
  "message": "Mesh (Aries) के लिए आज का राशिफल तैयार है!"
}
```

#### Get All Signs Horoscope
```http
GET /api/v1/horoscope/daily?date=YYYY-MM-DD

# Example:
GET /api/v1/horoscope/daily
```

### 📅 Weekly Horoscope

```http
GET /api/v1/horoscope/weekly/{raashi}?startDate=YYYY-MM-DD

# Examples:
GET /api/v1/horoscope/weekly/simha
GET /api/v1/horoscope/weekly/meen?startDate=2024-09-01
```

### 💬 Chat-Friendly Format

```http
GET /api/v1/horoscope/chat/{raashi}/{aspect}

# Examples:
GET /api/v1/horoscope/chat/mesh/overall
GET /api/v1/horoscope/chat/simha/love
GET /api/v1/horoscope/chat/kanya/career
```

**Supported Aspects:**
- `overall` - Complete horoscope
- `love` - Love and relationships
- `career` - Career and business
- `health` - Health and wellness
- `finance` - Money and wealth

### 🍀 Lucky Elements

```http
GET /api/v1/horoscope/lucky/{raashi}

# Example:
GET /api/v1/horoscope/lucky/tula
```

### 📆 Panchang (Hindu Calendar)

```http
GET /api/v1/horoscope/panchang?date=YYYY-MM-DD

# Example:
GET /api/v1/horoscope/panchang
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "panchang": {
      "date": "31/08/2024",
      "weekday": "शनिवार",
      "tithi": {
        "name": "द्वितीया",
        "type": "शुक्ल पक्ष",
        "percentage": "12.5"
      },
      "nakshatra": {
        "name": "अश्विनी",
        "lord": "केतु",
        "deity": "अश्विनी कुमार",
        "guna": "राजस"
      },
      "yoga": {
        "name": "विष्कुम्भ",
        "isAuspicious": false
      },
      "karana": {
        "name": "बव",
        "type": "चर"
      },
      "rahuKaal": {
        "time": "9:00 AM - 10:30 AM",
        "warning": "इस समय में कोई शुभ कार्य न करें"
      },
      "sunrise": "06:15",
      "sunset": "18:45",
      "moonPhase": "बढ़ता चांद (शुक्ल पक्ष)"
    }
  }
}
```

### ⭐ Nakshatra Information

```http
GET /api/v1/horoscope/nakshatra?date=YYYY-MM-DD

# Example:
GET /api/v1/horoscope/nakshatra
```

### 🪐 Planetary Positions

```http
GET /api/v1/horoscope/planets?date=YYYY-MM-DD

# Example:
GET /api/v1/horoscope/planets
```

## 🎭 Persona Integration

### Get Persona with Horoscope Context

```http
GET /api/v1/personas/{slug}/horoscope?raashi={raashi}&date=YYYY-MM-DD

# Examples:
GET /api/v1/personas/sanatan-vision/horoscope?raashi=mesh
GET /api/v1/personas/cosmic-didi/horoscope?raashi=simha&date=2024-08-31
```

**Response includes:**
- Complete persona information
- Daily horoscope for specified raashi
- Panchang details
- Contextual greeting based on persona style and current cosmic conditions

## 🌟 Supported Raashi (Zodiac Signs)

| English | Hindi | Sanskrit | Symbol | Element |
|---------|-------|----------|---------|---------|
| `mesh` | मेष | Aries | ♈ | अग्नि |
| `vrishabh` | वृषभ | Taurus | ♉ | पृथ्वी |
| `mithun` | मिथुन | Gemini | ♊ | वायु |
| `kark` | कर्क | Cancer | ♋ | जल |
| `simha` | सिंह | Leo | ♌ | अग्नि |
| `kanya` | कन्या | Virgo | ♍ | पृथ्वी |
| `tula` | तुला | Libra | ♎ | वायु |
| `vrishchik` | वृश्चिक | Scorpio | ♏ | जल |
| `dhanu` | धनु | Sagittarius | ♐ | अग्नि |
| `makar` | मकर | Capricorn | ♑ | पृथ्वी |
| `kumbh` | कुम्भ | Aquarius | ♒ | वायु |
| `meen` | मीन | Pisces | ♓ | जल |

## 🧪 Testing

### Run Horoscope Tests
```bash
# Test all horoscope functions
npm run test:horoscope

# Start server and test API
npm run dev

# Test specific endpoints
curl http://localhost:3000/api/v1/horoscope/daily/mesh
curl http://localhost:3000/api/v1/horoscope/panchang
curl http://localhost:3000/api/v1/horoscope/chat/simha/love
```

## 📱 Frontend Integration Examples

### JavaScript/React Usage

```javascript
// Get daily horoscope
const getHoroscope = async (raashi) => {
  const response = await fetch(`/api/v1/horoscope/daily/${raashi}`);
  const data = await response.json();
  return data.data;
};

// Get persona with horoscope context
const getPersonaWithHoroscope = async (personaSlug, raashi) => {
  const response = await fetch(`/api/v1/personas/${personaSlug}/horoscope?raashi=${raashi}`);
  const data = await response.json();
  return data.data;
};

// Display horoscope in chat
const displayHoroscope = (horoscope) => {
  return `
    ${horoscope.emoji} ${horoscope.raashi} राशिफल
    
    📊 ${horoscope.predictions.overall}
    
    💕 प्रेम: ${horoscope.predictions.love}
    🚀 करियर: ${horoscope.predictions.career}
    💪 स्वास्थ्य: ${horoscope.predictions.health}
    💰 धन: ${horoscope.predictions.finance}
    
    🍀 Lucky Number: ${horoscope.luckyElements.numbers[0]}
    🎨 Lucky Color: ${horoscope.luckyElements.colors[0]}
    🧿 Mantra: ${horoscope.mantra}
  `;
};
```

### Chatbot Integration

```javascript
// Handle horoscope request in chatbot
const handleHoroscopeRequest = async (userMessage, userRaashi) => {
  let aspect = 'overall';
  
  if (userMessage.includes('love') || userMessage.includes('प्रेम')) {
    aspect = 'love';
  } else if (userMessage.includes('career') || userMessage.includes('नौकरी')) {
    aspect = 'career';
  } else if (userMessage.includes('health') || userMessage.includes('स्वास्थ्य')) {
    aspect = 'health';
  } else if (userMessage.includes('money') || userMessage.includes('पैसा')) {
    aspect = 'finance';
  }
  
  const response = await fetch(`/api/v1/horoscope/chat/${userRaashi}/${aspect}`);
  const data = await response.json();
  
  return data.data.response;
};
```

## 🔮 Advanced Features

### Custom Date Calculations
All endpoints support custom date queries for historical or future predictions:

```bash
# Historical horoscope
GET /api/v1/horoscope/daily/mesh?date=2024-01-01

# Future horoscope  
GET /api/v1/horoscope/daily/mesh?date=2024-12-31

# Historical panchang
GET /api/v1/horoscope/panchang?date=2024-06-15
```

### Bulk Operations
```bash
# Get all signs for specific date
GET /api/v1/horoscope/daily?date=2024-09-01

# Get weekly predictions
GET /api/v1/horoscope/weekly/mesh?startDate=2024-09-01
```

### Error Handling
All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Invalid raashi. Valid options: mesh, vrishabh, mithun, ..."
}
```

## 🛠️ Customization

### Adding New Remedies
Edit `src/services/dailyHoroscope.js`:

```javascript
const dailyRemedies = {
  surya: [
    "सूर्योदय के समय सूर्य को जल अर्पित करें",
    "लाल रंग के वस्त्र पहनें",
    // Add your custom remedies here
  ]
};
```

### Custom Predictions
Modify `horoscopePredictions` object in the same file to add your own prediction texts.

### Persona Integration
Each persona generates contextual greetings based on horoscope data. Customize in `generateContextualGreeting()` function.

---

## 🎉 Ready to Use!

Your complete Vedic Astrology Daily Horoscope system is now ready! Start the server and begin providing personalized cosmic guidance to your users.

```bash
npm run dev
npm run test:horoscope
```

**May the stars guide your code! 🌟✨**
