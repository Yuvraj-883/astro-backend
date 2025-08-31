// GraphQL Schema for Astro API
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    # Horoscope queries
    dailyHoroscope(raashi: String!, date: String): Horoscope
    allHoroscopes(date: String): [Horoscope]
    weeklyHoroscope(raashi: String!, startDate: String): WeeklyHoroscope
    
    # Persona queries
    personas(category: String, limit: Int): [Persona]
    persona(slug: String!): Persona
    defaultPersona: Persona
    
    # Review queries
    reviews(personaSlug: String!, page: Int, limit: Int, rating: Int): ReviewResponse
    reviewStats(personaSlug: String!): ReviewStats
    featuredReviews(personaSlug: String): [Review]
    
    # Enhanced horoscope
    personalizedHoroscope(birthData: BirthDataInput!): PersonalizedHoroscope
    compatibility(person1: BirthDataInput!, person2: BirthDataInput!): CompatibilityResult
  }

  type Mutation {
    # Review mutations
    createReview(personaSlug: String!, review: ReviewInput!): Review
    voteReviewHelpful(reviewId: ID!): Review
    
    # Birth chart mutations
    createBirthChart(data: BirthChartInput!): BirthChart
    
    # Persona usage
    updatePersonaUsage(slug: String!, usage: UsageInput!): Persona
  }

  # Types
  type Horoscope {
    date: String
    raashi: String
    emoji: String
    predictions: Predictions
    luckyElements: LuckyElements
    remedies: Remedies
    mantra: String
    panchang: Panchang
  }

  type Persona {
    id: ID!
    name: String!
    slug: String!
    role: String!
    category: String!
    personality: Personality
    specializations: Specializations
    averageRating: Float
    totalReviews: Int
    isDefault: Boolean
  }

  type Review {
    id: ID!
    userName: String!
    rating: Int!
    title: String!
    comment: String!
    aspects: ReviewAspects
    helpfulVotes: Int
    createdAt: String
  }

  # Input types
  input BirthDataInput {
    birthDate: String!
    birthTime: String!
    birthPlace: String!
    name: String
  }

  input ReviewInput {
    userName: String!
    rating: Int!
    title: String!
    comment: String!
    aspects: ReviewAspectsInput
    sessionDuration: Int
    messagesExchanged: Int
  }
`;

export const resolvers = {
  Query: {
    dailyHoroscope: async (_, { raashi, date }) => {
      // Implementation here
    },
    personas: async (_, { category, limit }) => {
      // Implementation here
    },
    // ... other resolvers
  },
  
  Mutation: {
    createReview: async (_, { personaSlug, review }) => {
      // Implementation here
    },
    // ... other mutations
  }
};
