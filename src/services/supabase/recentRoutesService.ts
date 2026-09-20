import { supabase } from '../../lib/supabase';
import { RecentRouteRow, RecentRouteInsert } from '../../types/database';

export interface RecentRoutesResult<T> {
  data: T | null;
  error: string | null;
}

export const recentRoutesService = {
  /**
   * Fetch recent routes for current user.
   */
  async fetchRecentRoutes(): Promise<RecentRoutesResult<RecentRouteRow[]>> {
    try {
      const { data, error } = await supabase
        .from('recent_routes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch recent routes';
      return { data: null, error: message };
    }
  },

  /**
   * Record a completed or calculated route session.
   */
  async recordRecentRoute(
    destinationName: string,
    distanceMeters: number,
    durationSeconds: number
  ): Promise<RecentRoutesResult<RecentRouteRow>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Unauthenticated users do not write to cloud
        return { data: null, error: 'User is not signed in' };
      }

      const distanceKm = parseFloat((distanceMeters / 1000).toFixed(1));
      const durationMin = Math.ceil(durationSeconds / 60);

      const newRoute: RecentRouteInsert = {
        user_id: user.id,
        destination_name: destinationName,
        distance: distanceKm,
        duration: durationMin,
      };

      const { data, error } = await supabase
        .from('recent_routes')
        .insert(newRoute)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to record recent route';
      return { data: null, error: message };
    }
  },
};
