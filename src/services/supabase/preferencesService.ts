import { supabase } from '../../lib/supabase';
import { NavigationPreferencesRow, NavigationPreferencesInsert, NavigationPreferencesUpdate } from '../../types/database';

export interface PreferencesResult<T> {
  data: T | null;
  error: string | null;
}

export const preferencesService = {
  /**
   * Fetch navigation preferences for current user.
   */
  async fetchPreferences(): Promise<PreferencesResult<NavigationPreferencesRow>> {
    try {
      const { data, error } = await supabase
        .from('navigation_preferences')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch preferences';
      return { data: null, error: message };
    }
  },

  /**
   * Save or update navigation preferences.
   */
  async savePreferences(preferences: {
    voice_enabled?: boolean;
    dark_mode?: boolean;
  }): Promise<PreferencesResult<NavigationPreferencesRow>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User is not signed in' };
      }

      // Check if row already exists for user
      const { data: existing } = await supabase
        .from('navigation_preferences')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        const updatePayload: NavigationPreferencesUpdate = {
          ...(preferences.voice_enabled !== undefined && { voice_enabled: preferences.voice_enabled }),
          ...(preferences.dark_mode !== undefined && { dark_mode: preferences.dark_mode }),
        };

        const { data, error } = await supabase
          .from('navigation_preferences')
          .update(updatePayload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      } else {
        const insertPayload: NavigationPreferencesInsert = {
          user_id: user.id,
          voice_enabled: preferences.voice_enabled ?? true,
          dark_mode: preferences.dark_mode ?? true,
        };

        const { data, error } = await supabase
          .from('navigation_preferences')
          .insert(insertPayload)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save preferences';
      return { data: null, error: message };
    }
  },
};
