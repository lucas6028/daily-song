import useSWR from 'swr';
import axios from 'axios';
import type { Artist, SpotifyTracksResponse, Track } from 'types/types';

const fetcher = (
  url: string,
  params: { limit: number; seed_artists: string; min_popularity: number }
) => axios.get<SpotifyTracksResponse>(url, { params, withCredentials: true }).then(res => res.data);

export function useRecommendedTracks(artists: Artist[], minPopularity: number) {
  const { data, error, isLoading } = useSWR(
    artists.length > 0
      ? [
          '/api/track/recommend',
          {
            limit: 10,
            seed_artists: artists[0].id,
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

  const tracks: Track[] =
    data?.body.tracks.map(track => ({
      albumName: track.album.name,
      albumUri: track.album.uri,
      artist: track.artists[0].name,
      artistUri: track.artists[0].uri,
      title: track.name,
      id: track.id,
      trackUri: track.uri,
      img: track.album.images[1].url,
    })) || [];

  return {
    tracks,
    isLoading,
    tracksError: error ? 'Failed to fetch recommended tracks' : null,
  };
}
