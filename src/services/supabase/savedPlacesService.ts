import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { SavedPlaceRow, SavedPlaceInsert, SavedPlaceUpdate } from '../../types/database';

export interface SavedPlacesResult<T> {
  data: T | null;
  error: string | null;
}

export const savedPlacesService = {
  /**
   * Fetch all saved places for the current authenticated user.
   */
  async fetchSavedPlaces(): Promise<SavedPlacesResult<SavedPlaceRow[]>> {
    if (!isSupabaseConfigured) {
      return { data: [], error: null };
    }
    try {
      const { data, error } = await supabase
        .from('saved_places')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch saved places';
      return { data: null, error: message };
    }
  },

  /**
   * Insert a new saved place.
   */
  async createSavedPlace(name: string, latitude: number, longitude: number): Promise<SavedPlacesResult<SavedPlaceRow>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: 'Supabase is not configured' };
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: 'User is not signed in' };
      }

      const newPlace: SavedPlaceInsert = {
        name,
        latitude,
        longitude,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('saved_places')
        .insert(newPlace)
        .select()
        .single();

      if (error) throw error;
      return { data: data as SavedPlaceRow, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create saved place';
      return { data: null, error: message };
    }
  },

  /**
   * Update an existing saved place.
   */
  async updateSavedPlace(id: string, updates: SavedPlaceUpdate): Promise<SavedPlacesResult<SavedPlaceRow>> {
    if (!isSupabaseConfigured) {
      return { data: null, error: 'Supabase is not configured' };
    }
    try {
      const { data, error } = await supabase
        .from('saved_places')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as SavedPlaceRow, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update saved place';
      return { data: null, error: message };
    }
  },

  /**
   * Delete a saved place by ID.
   */
  async deleteSavedPlace(id: string): Promise<SavedPlacesResult<boolean>> {
    if (!isSupabaseConfigured) {
      return { data: true, error: null };
    }
    try {
      const { error } = await supabase
        .from('saved_places')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { data: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete saved place';
      return { data: false, error: message };
    }
  },
};
