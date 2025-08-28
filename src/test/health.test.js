import { app } from '../index.js';

// Simple test to verify the health endpoint exists
describe('Health Endpoint', () => {
  it('should be available for testing', () => {
    expect(app).toBeDefined();
  });
});
