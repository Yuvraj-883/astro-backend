// React Hooks for Astro API
import { useState, useEffect, useCallback } from 'react';
import { astroClient } from './astro-client';

// Custom hook for daily horoscope
export const useDailyHoroscope = (raashi: string, date?: string) => {
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHoroscope = useCallback(async () => {
    if (!raashi) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await astroClient.getDailyHoroscope(raashi, date);
      setHoroscope(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [raashi, date]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  return { horoscope, loading, error, refetch: fetchHoroscope };
};

// Custom hook for personas
export const usePersonas = (category?: string) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonas = async () => {
      setLoading(true);
      try {
        const response = await astroClient.getPersonas(category);
        setPersonas(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [category]);

  return { personas, loading, error };
};

// Custom hook for reviews
export const useReviews = (personaSlug: string, options?: {
  page?: number;
  limit?: number;
  rating?: number;
}) => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!personaSlug) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await astroClient.getReviews(personaSlug, options);
        setReviews(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [personaSlug, options?.page, options?.limit, options?.rating]);

  return { reviews, pagination, loading, error };
};

// Hook for creating reviews
export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReview = async (personaSlug: string, reviewData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await astroClient.createReview(personaSlug, reviewData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createReview, loading, error };
};

// Usage in React component:
/*
function HoroscopePage() {
  const { horoscope, loading, error } = useDailyHoroscope('mesh');
  const { personas } = usePersonas('traditional');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{horoscope?.raashi} {horoscope?.emoji}</h1>
      <p>{horoscope?.predictions.overall}</p>
      
      <div>
        <h2>Available Personas:</h2>
        {personas.map(persona => (
          <div key={persona.id}>{persona.name}</div>
        ))}
      </div>
    </div>
  );
}
*/
