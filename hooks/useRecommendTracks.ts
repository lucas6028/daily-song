import useSWR from 'swr';
import axios from 'axios';
import { LastfmRecommendTrack, Track } from 'types/types';

const fetcher = (url: string, params: { limit: number; seed_artist: string; seed_track: string }) =>
  axios.get(url, { params, withCredentials: true }).then(res => res.data);

export function useRecommendedTracks(track: string, artist: string, limit = 10) {
  const { data, error, isLoading } = useSWR(
    track && artist
      ? [
          '/api/track/recommend',
          {
            limit: limit,
            seed_track: track,
            seed_artist: artist,
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

  if (!track || !artist) {
    return {
      tracks: [],
      isLoading: true,
      tracksError: 'Please select a track and an artist',
    };
  }

  const tracks: Track[] =
    data?.tracks.map((track: LastfmRecommendTrack) => ({
      artist: track.artist.name,
      artistUri: track.artist.url,
      title: track.name,
      trackUri: track.url,
      img: track.image[3]['#text'],
      id: track.mbid,
    })) || [];

  return {
    tracks,
    isLoading,
    tracksError: error ? 'Failed to fetch recommended tracks' : null,
  };
}
