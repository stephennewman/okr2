import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Optional: Mock global objects or functions if needed
// For example, mocking matchMedia which is often used by UI libraries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock environment variables if your tests rely on them
// process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
// process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// You can add other global setup here 