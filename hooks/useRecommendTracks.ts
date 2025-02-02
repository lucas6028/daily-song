import useSWR from 'swr';
import axios from 'axios';
import type { Artist, RecommendTrack, Track } from 'types/types';

const fetcher = (
  url: string,
  params: { limit: number; seed_artists: string; min_popularity: number }
) => axios.get(url, { params, withCredentials: true }).then(res => res.data);

export function useRecommendedTracks(artists: Artist[], minPopularity: number) {
  const { data, error, isLoading } = useSWR(
    artists.length > 0
      ? [
          '/api/track/recommend',
          {
            limit: 5,
            seed_artists: artists[0].name,
            min_popularity: minPopularity,
          },
        ]
      : null,
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      // revalidateOnReconnect: false,
      // refreshInterval: 0, // Disable periodic polling
    }
  );

  const tracks: RecommendTrack[] =
    data?.map((track: RecommendTrack) => ({
      artist_name: track.artist_name,
      title: track.title,
      track_uri: track.track_uri,
      img_url: track.img_url,
    })) || [];

  return {
    tracks,
    isLoading,
    tracksError: error ? 'Failed to fetch recommended tracks' : null,
  };
}
