# Astro Chatbot Review System 🌟

Complete user review and rating system for astrology personas with MongoDB persistence, analytics, and moderation capabilities.

## 🚀 Features

### Core Functionality
- ⭐ **5-Star Rating System** - Overall experience rating
- 💬 **Detailed Comments** - User feedback and experiences  
- 📊 **Aspect Ratings** - Accuracy, Helpfulness, Communication, Personality
- 👥 **Multi-Persona Support** - Reviews for all 4 persona types
- 🔒 **Spam Prevention** - IP-based duplicate detection
- ✅ **Moderation System** - Admin approval workflow
- 📈 **Analytics & Stats** - Comprehensive review insights

### Advanced Features
- 🌟 **Featured Reviews** - Highlight best testimonials
- 👍 **Helpful Votes** - Community-driven review quality
- 📱 **Multi-Platform** - Web and mobile tracking
- 🌍 **Language Support** - Hinglish and regional preferences
- 🏷️ **Tag System** - Categorize review themes
- ⏱️ **Session Tracking** - Duration and message count

## 📁 File Structure

```
src/
├── models/
│   ├── Persona.js          # Persona schema with rating aggregation
│   └── PersonaReview.js    # Review schema with validation
├── controllers/
│   └── reviewController.js # Review CRUD operations & analytics
├── routes/
│   └── reviewRoutes.js     # Public & admin API endpoints
├── examples/
│   └── reviewExamples.js   # Sample data & API usage
├── scripts/
│   └── testReviewSystem.js # Testing & seeding script
└── index.js               # Main app with route integration
```

## 🔧 API Endpoints

### Public Endpoints

#### Create Review
```http
POST /api/v1/reviews/persona/:slug
Content-Type: application/json

{
  "userName": "Rajesh Kumar",
  "rating": 5,
  "title": "Amazing experience!",
  "comment": "Bahut accurate predictions the...",
  "aspects": {
    "accuracy": 5,
    "helpfulness": 5,
    "communication": 4,
    "personality": 5
  },
  "sessionDuration": 20,
  "messagesExchanged": 8,
  "language": "hinglish",
  "platform": "web",
  "tags": ["accurate", "helpful"]
}
```

#### Get Persona Reviews
```http
GET /api/v1/reviews/persona/:slug?page=1&limit=10&sortBy=rating&sortOrder=desc
```

#### Get Review Statistics
```http
GET /api/v1/reviews/persona/:slug/stats
```

#### Mark Review Helpful
```http
POST /api/v1/reviews/:reviewId/helpful
```

#### Get Featured Reviews
```http
GET /api/v1/reviews/featured?limit=5
```

### Admin Endpoints

#### Moderate Review
```http
POST /api/v1/reviews/:reviewId/moderate
Content-Type: application/json

{
  "isApproved": true,
  "moderatorNotes": "Approved - genuine review"
}
```

#### Feature Review
```http
POST /api/v1/reviews/:reviewId/feature
Content-Type: application/json

{
  "isFeatured": true
}
```

## 📊 Response Examples

### Review Statistics
```json
{
  "success": true,
  "data": {
    "totalReviews": 25,
    "averageRating": 4.2,
    "ratingDistribution": {
      "5": 10,
      "4": 8,
      "3": 5,
      "2": 2,
      "1": 0
    },
    "aspectRatings": {
      "accuracy": 4.3,
      "helpfulness": 4.1,
      "communication": 4.0,
      "personality": 4.4
    },
    "recentReviews": [...],
    "featuredReviews": [...],
    "tagStats": [
      { "tag": "accurate", "count": 15 },
      { "tag": "helpful", "count": 12 }
    ]
  }
}
```

### Review List
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789",
      "userName": "Rajesh Kumar",
      "rating": 5,
      "title": "Excellent guidance!",
      "comment": "Very helpful and accurate...",
      "aspects": {
        "accuracy": 5,
        "helpfulness": 5,
        "communication": 4,
        "personality": 5
      },
      "helpfulVotes": 3,
      "isFeatured": true,
      "createdAt": "2024-08-30T10:30:00Z",
      "daysAgo": "2 days ago"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalReviews": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🎯 Persona Types

### 1. Traditional (sanatan-vision)
- **Name**: Acharya Roshan Sharma
- **Style**: Classical Vedic astrology
- **Speciality**: Traditional remedies, Sanskrit terminology

### 2. Modern (cosmic-didi)
- **Name**: Tamanna Singh "Cosmic Didi"
- **Style**: Contemporary, trendy approach
- **Speciality**: Career guidance, modern life issues

### 3. Tantric (tantrik-master)
- **Name**: Sandeep Baba
- **Style**: Mystical, powerful remedies
- **Speciality**: Dosha resolution, tantric solutions

### 4. Love Guru (love-guru-priya)
- **Name**: Priya Sharma
- **Style**: Caring, relationship-focused
- **Speciality**: Love compatibility, marriage guidance

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up MongoDB
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://...
```

### 3. Seed Data
```bash
# Create personas
npm run seed:personas

# Create sample reviews
npm run seed:reviews
```

### 4. Start Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Test API
```bash
# Test review system
npm run test:reviews

# Example API calls
curl http://localhost:3000/api/v1/reviews/persona/sanatan-vision
curl http://localhost:3000/api/v1/reviews/persona/sanatan-vision/stats
```

## 🔍 Validation Rules

### Review Validation
- **Rating**: 1-5 (required)
- **Title**: 10-100 characters
- **Comment**: 20-2000 characters
- **User Name**: 2-50 characters
- **Aspects**: Each 1-5 rating
- **Session Duration**: Positive number (minutes)
- **Language**: Enum values (hinglish, hindi, english)

### Security Features
- IP hashing for spam prevention
- Rate limiting (same IP, same persona)
- Input sanitization
- XSS protection
- Moderation workflow

## 📈 Analytics Features

### Review Metrics
- Total reviews count
- Average rating calculation
- Rating distribution charts
- Aspect-wise performance
- Temporal analysis (reviews over time)

### Persona Performance
- Auto-updating persona ratings
- Review count tracking
- Featured review highlighting
- Tag-based categorization

### User Engagement
- Helpful votes tracking
- Comment length analysis
- Session duration insights
- Platform usage statistics

## 🛠️ Development Tools

### Testing
```bash
# Run complete test suite
npm run test:reviews

# Test specific persona
node src/scripts/testReviewSystem.js
```

### Database Management
```bash
# Connect to MongoDB
npm run db:connect

# Clear reviews (development only)
db.personareviews.deleteMany({})
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Check types
npm run type-check
```

## 📊 Performance Considerations

### Database Optimization
- Indexed fields: `personaSlug`, `rating`, `createdAt`
- Compound indexes for common queries
- Aggregation pipelines for statistics
- Efficient pagination with skip/limit

### Caching Strategy
- Review statistics caching (5 minutes)
- Featured reviews caching (1 hour)
- Persona rating caching (immediate update)

### Scalability Features
- Background rating calculations
- Bulk review operations
- Efficient aggregation queries
- Pagination for large datasets

## 🔒 Security Implementation

### Data Protection
- IP address hashing (SHA-256)
- Input validation & sanitization
- SQL injection prevention
- XSS attack mitigation

### Access Control
- Public vs admin endpoints
- Rate limiting per IP
- Moderation approval workflow
- Spam detection algorithms

## 🌟 Best Practices

### Review Quality
- Encourage detailed feedback
- Moderate inappropriate content
- Feature high-quality reviews
- Track helpful vote patterns

### User Experience
- Mobile-responsive design
- Fast API response times
- Clear error messages
- Intuitive pagination

### Content Management
- Regular moderation cycles
- Featured review rotation
- Tag cleanup and optimization
- Analytics dashboard updates

---

## 📞 Support

For questions or issues:
- 📧 Email: support@astrochatbot.com
- 📱 Telegram: @astro_support
- 💬 Discord: Astro Community

**Happy coding! 🚀✨**
