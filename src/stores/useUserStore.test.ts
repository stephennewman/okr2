import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from './useUserStore'
import { type User } from '@supabase/supabase-js'

// Mock Supabase User object for testing
const mockUser: User = {
  id: '123',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

describe('useUserStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  it('should initialize with null user', () => {
    const { user } = useUserStore.getState();
    expect(user).toBeNull();
  });

  it('should set the user correctly', () => {
    const { setUser } = useUserStore.getState();
    setUser(mockUser);
    const { user } = useUserStore.getState();
    expect(user).toEqual(mockUser);
  });

  it('should clear the user', () => {
    const { setUser, clearUser } = useUserStore.getState();
    setUser(mockUser); // Set a user first
    expect(useUserStore.getState().user).not.toBeNull(); // Verify user is set

    clearUser(); // Clear the user
    const { user } = useUserStore.getState();
    expect(user).toBeNull(); // Verify user is cleared
  });

  it('should allow setting user to null via setUser', () => {
    const { setUser } = useUserStore.getState();
    setUser(mockUser); // Set a user first
    expect(useUserStore.getState().user).not.toBeNull(); // Verify user is set

    setUser(null); // Set user to null
    const { user } = useUserStore.getState();
    expect(user).toBeNull(); // Verify user is null
  });
}); 