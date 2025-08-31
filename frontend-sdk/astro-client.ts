// TypeScript SDK for Astro API
// This can be auto-generated from OpenAPI spec

export interface HoroscopeResponse {
  success: boolean;
  data: Horoscope;
  message: string;
}

export interface Horoscope {
  date: string;
  raashi: string;
  emoji: string;
  predictions: {
    overall: string;
    love: string;
    career: string;
    health: string;
    finance: string;
  };
  luckyElements: {
    numbers: number[];
    colors: string[];
    direction: string;
    time: string;
  };
  remedies: {
    planetary: string[];
    general: string[];
    gemstone: string;
    color: string;
  };
  mantra: string;
  panchang: Panchang;
}

export interface Persona {
  id: string;
  name: string;
  slug: string;
  role: string;
  category: 'traditional' | 'modern' | 'tantric' | 'romantic';
  averageRating: number;
  totalReviews: number;
  isDefault: boolean;
}

export class AstroClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'http://localhost:8000/api/v1', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Horoscope methods
  async getDailyHoroscope(raashi: string, date?: string): Promise<HoroscopeResponse> {
    const query = date ? `?date=${date}` : '';
    return this.request<HoroscopeResponse>(`/horoscope/daily/${raashi}${query}`);
  }

  async getAllHoroscopes(date?: string): Promise<{ success: boolean; data: Horoscope[] }> {
    const query = date ? `?date=${date}` : '';
    return this.request(`/horoscope/daily${query}`);
  }

  async getWeeklyHoroscope(raashi: string, startDate?: string): Promise<HoroscopeResponse> {
    const query = startDate ? `?startDate=${startDate}` : '';
    return this.request<HoroscopeResponse>(`/horoscope/weekly/${raashi}${query}`);
  }

  async getPanchang(date?: string): Promise<any> {
    const query = date ? `?date=${date}` : '';
    return this.request(`/horoscope/panchang${query}`);
  }

  // Persona methods
  async getPersonas(category?: string): Promise<{ success: boolean; data: Persona[] }> {
    const query = category ? `?category=${category}` : '';
    return this.request(`/personas${query}`);
  }

  async getPersona(slug: string): Promise<{ success: boolean; data: Persona }> {
    return this.request(`/personas/${slug}`);
  }

  async getDefaultPersona(): Promise<{ success: boolean; data: Persona }> {
    return this.request('/personas/default');
  }

  // Review methods
  async getReviews(personaSlug: string, options?: {
    page?: number;
    limit?: number;
    rating?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.rating) params.append('rating', options.rating.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/reviews/persona/${personaSlug}${query}`);
  }

  async createReview(personaSlug: string, review: {
    userName: string;
    rating: number;
    title: string;
    comment: string;
    aspects?: {
      accuracy: number;
      helpfulness: number;
      communication: number;
      personality: number;
    };
    sessionDuration?: number;
    messagesExchanged?: number;
  }): Promise<any> {
    return this.request(`/reviews/persona/${personaSlug}`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Enhanced horoscope methods
  async getPersonalizedHoroscope(data: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    zodiacSign: string;
  }): Promise<any> {
    return this.request('/enhanced/personalized-horoscope', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkCompatibility(person1: any, person2: any): Promise<any> {
    return this.request('/enhanced/compatibility', {
      method: 'POST',
      body: JSON.stringify({ person1, person2 }),
    });
  }

  // Utility methods
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

// Export default instance
export const astroClient = new AstroClient();

// Usage example:
/*
import { astroClient } from './astro-sdk';

// Get daily horoscope
const horoscope = await astroClient.getDailyHoroscope('mesh');

// Get all personas
const personas = await astroClient.getPersonas();

// Create a review
await astroClient.createReview('sanatan-vision', {
  userName: 'John Doe',
  rating: 5,
  title: 'Great experience!',
  comment: 'Very accurate predictions.'
});
*/
