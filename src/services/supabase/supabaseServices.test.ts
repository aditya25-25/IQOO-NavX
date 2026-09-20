import { describe, it, expect, vi } from 'vitest';
import { savedPlacesService } from './savedPlacesService';
import { preferencesService } from './preferencesService';
import { recentRoutesService } from './recentRoutesService';
import { authService } from './authService';
import { supabase } from '../../lib/supabase';

describe('Supabase Service Layer', () => {
  it('should initialize centralized supabase client', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
    expect(typeof supabase.auth).toBe('object');
  });

  describe('authService', () => {
    it('should expose auth methods', () => {
      expect(typeof authService.signUp).toBe('function');
      expect(typeof authService.signIn).toBe('function');
      expect(typeof authService.signOut).toBe('function');
      expect(typeof authService.getCurrentUser).toBe('function');
      expect(typeof authService.getSession).toBe('function');
      expect(typeof authService.onAuthStateChange).toBe('function');
    });

    it('should return error when signing in fails', async () => {
      vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { user: null, session: null },
        error: new Error('Invalid login credentials') as any,
      });

      const res = await authService.signIn('invalid@test.com', 'wrong');
      expect(res.error).toBe('Invalid login credentials');
      expect(res.data).toBeNull();
    });
  });

  describe('savedPlacesService', () => {
    it('should expose CRUD methods', () => {
      expect(typeof savedPlacesService.fetchSavedPlaces).toBe('function');
      expect(typeof savedPlacesService.createSavedPlace).toBe('function');
      expect(typeof savedPlacesService.updateSavedPlace).toBe('function');
      expect(typeof savedPlacesService.deleteSavedPlace).toBe('function');
    });

    it('should handle unauthenticated createSavedPlace gracefully', async () => {
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: null },
        error: null,
      } as any);

      const res = await savedPlacesService.createSavedPlace('Test HQ', 12.97, 77.59);
      expect(res.error).toBe('User is not signed in');
      expect(res.data).toBeNull();
    });
  });

  describe('preferencesService', () => {
    it('should expose preference methods', () => {
      expect(typeof preferencesService.fetchPreferences).toBe('function');
      expect(typeof preferencesService.savePreferences).toBe('function');
    });

    it('should handle unauthenticated savePreferences gracefully', async () => {
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: null },
        error: null,
      } as any);

      const res = await preferencesService.savePreferences({ voice_enabled: true });
      expect(res.error).toBe('User is not signed in');
      expect(res.data).toBeNull();
    });
  });

  describe('recentRoutesService', () => {
    it('should expose recent routes methods', () => {
      expect(typeof recentRoutesService.fetchRecentRoutes).toBe('function');
      expect(typeof recentRoutesService.recordRecentRoute).toBe('function');
    });

    it('should handle unauthenticated recordRecentRoute gracefully', async () => {
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValueOnce({
        data: { user: null },
        error: null,
      } as any);

      const res = await recentRoutesService.recordRecentRoute('College Campus', 4500, 600);
      expect(res.error).toBe('User is not signed in');
      expect(res.data).toBeNull();
    });
  });
});
