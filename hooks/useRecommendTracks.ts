import useSWR from 'swr';
import axios from 'axios';
import { KKBOXTrack, Track } from 'types/types';

const fetcher = (
  url: string,
  params: { limit: number; track_id: string; offset: number; territory: string }
) => axios.get(url, { params, withCredentials: true }).then(res => res.data);

export function useRecommendedTracks(trackId: string, territory: string, limit = 10, offset = 0) {
  const { data, error, isLoading } = useSWR(
    trackId
      ? [
          '/api/track/recommend',
          {
            track_id: trackId,
            territory: territory,
            limit: limit,
            offset: offset,
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

  if (!trackId) {
    return {
      tracks: [],
      isLoading: true,
      tracksError: 'Please select a track and an artist',
    };
  }

  const tracks: Track[] =
    data?.tracks.map((track: KKBOXTrack) => ({
      artist: track.album.artist.name,
      artistUri: track.album.artist.url,
      title: track.name,
      trackUri: track.url,
      img: track.album.images[1].url,
      id: track.id,
    })) || [];

  return {
    tracks,
    isLoading,
    tracksError: error ? 'Failed to fetch recommended tracks' : null,
  };
}
