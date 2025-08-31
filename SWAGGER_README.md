# 📚 Astro API Documentation with Swagger

Your API now has interactive documentation powered by **OpenAPI 3.0** and **Swagger UI**!

## 🚀 Access Documentation

**Interactive API Docs:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

## ✨ What You Get

### 🎯 **Interactive Testing**
- **Try It Out** buttons for every endpoint
- **Live API calls** directly from the browser
- **Real responses** with your actual data
- **Request/Response examples** in multiple formats

### 📖 **Comprehensive Documentation**
- **Complete API reference** with all endpoints
- **Request/Response schemas** with examples
- **Parameter descriptions** and validation rules
- **Error response formats** and status codes

### 🔧 **Developer-Friendly Features**
- **Copy-paste cURL commands** generated automatically
- **Multiple programming language examples**
- **JSON schema validation**
- **API versioning information**

## 📋 **Available Endpoints**

### 🏥 **Health Check**
- `GET /health` - API health status

### 🔮 **Horoscope System**
- `GET /horoscope/daily/{raashi}` - Daily horoscope for specific sign
- `GET /horoscope/daily` - Daily horoscope for all 12 signs
- `GET /horoscope/weekly/{raashi}` - Weekly horoscope
- `GET /horoscope/panchang` - Current Panchang data
- `GET /horoscope/nakshatra` - Current Nakshatra info
- `GET /horoscope/planets` - Planetary positions
- `GET /horoscope/chat/{raashi}/{aspect}` - Chat-format horoscope
- `GET /horoscope/lucky/{raashi}` - Lucky elements

### 🧬 **Enhanced Horoscope (Personalized)**
- `POST /enhanced/personalized-horoscope` - Personalized predictions
- `POST /enhanced/birth-chart` - Create birth chart
- `GET /enhanced/birth-chart/{id}` - Get birth chart
- `POST /enhanced/compatibility` - Compatibility check
- `POST /enhanced/compare-accuracy` - Accuracy comparison

### 👥 **Personas Management**
- `GET /personas` - All personas with filtering
- `GET /personas/default` - Default persona
- `GET /personas/{slug}` - Specific persona details
- `POST /personas/{slug}/usage` - Update usage stats

### 📝 **Reviews & Ratings**
- `GET /reviews/persona/{slug}` - Get persona reviews
- `POST /reviews/persona/{slug}` - Create new review
- `GET /reviews/persona/{slug}/stats` - Review statistics
- `GET /reviews/featured` - Featured reviews
- `POST /reviews/{id}/helpful` - Mark review helpful

### 🌟 **Astro Chat**
- `POST /astro/chat` - AI-powered astrology chat

## 🎨 **Swagger UI Features**

### **🔍 Explore Mode**
```
http://localhost:8000/api/docs
```

### **📱 Try It Out**
1. Click any endpoint
2. Click "Try it out"
3. Fill in parameters
4. Click "Execute"
5. See real response!

### **📋 Copy cURL Commands**
Every endpoint generates ready-to-use cURL commands:

```bash
curl -X 'GET' \
  'http://localhost:8000/api/v1/horoscope/daily/mesh' \
  -H 'accept: application/json'
```

## 🏗️ **Schema Documentation**

### **🔮 Horoscope Schema**
Complete Vedic horoscope with:
- Predictions (overall, love, career, health, finance)
- Lucky elements (numbers, colors, direction, time)
- Remedies (planetary, general, gemstone)
- Panchang data (tithi, nakshatra, yoga)

### **👤 Persona Schema**
Astrology personas with:
- Basic info (name, role, category)
- Personality traits (tone, formality, emotional level)
- Specializations (vedic, tantric, numerology, etc.)
- Usage statistics (sessions, ratings, reviews)

### **⭐ Review Schema**
User reviews with:
- Rating and aspects breakdown
- Session details and platform info
- Helpful votes and moderation status
- Rich metadata and tags

## 🚀 **Getting Started Guide**

### **1. Health Check**
```bash
curl http://localhost:8000/api/v1/health
```

### **2. Get Daily Horoscope**
```bash
curl http://localhost:8000/api/v1/horoscope/daily/mesh
```

### **3. List All Personas**
```bash
curl http://localhost:8000/api/v1/personas
```

### **4. Create a Review**
```bash
curl -X POST http://localhost:8000/api/v1/reviews/persona/sanatan-vision \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Test User",
    "rating": 5,
    "title": "Great experience!",
    "comment": "Very accurate predictions."
  }'
```

## 🎯 **Comparison: Before vs After**

### **❌ Before (cURL File)**
- Static documentation
- Manual copy-paste commands
- No validation
- No examples
- Hard to maintain

### **✅ After (Swagger)**
- Interactive documentation
- Live API testing
- Auto-validation
- Rich examples
- Self-documenting

## 📊 **Usage Analytics**

The Swagger UI provides:
- **Response times** for each request
- **Request/Response size** information
- **Status code** distributions
- **Error tracking** and debugging

## 🔧 **Customization**

### **Custom Styling**
The documentation includes:
- Custom CSS for better readability
- Branded colors and fonts
- Mobile-responsive design
- Dark/light theme support

### **Advanced Features**
- **Request authentication** (if needed)
- **Rate limiting** information
- **Versioning** support
- **Environment switching**

## 🌟 **Benefits for Frontend Teams**

### **🚀 Faster Development**
- No need to read through code
- Instant API understanding
- Copy-paste ready examples
- Real-time testing

### **🛡️ Better Integration**
- Type-safe schemas
- Validation rules
- Error handling examples
- Response format guarantees

### **📱 Multi-Platform Support**
- Web applications
- Mobile apps
- Desktop applications
- Third-party integrations

## 🎉 **Next Steps**

1. **Explore the documentation** at `/api/docs`
2. **Test all endpoints** using Try It Out
3. **Generate client SDKs** (optional)
4. **Share with frontend teams**
5. **Use for testing and debugging**

---

## 💡 **Pro Tips**

### **🔥 Quick Testing**
Use the built-in "Try it out" feature to test APIs without Postman or cURL.

### **📋 Copy Examples**
All request/response examples are copy-paste ready for your frontend code.

### **🐛 Debugging**
Use the real-time response feature to debug API issues quickly.

### **📚 Learning**
New team members can understand the entire API in minutes.

---

**🌟 Your API documentation is now professional, interactive, and developer-friendly! 🌟**
