import useSWR from 'swr';
import axios from 'axios';
import { LastfmRecommendTrack, Track } from 'types/types';

const fetcher = (url: string, params: { limit: number; page: number }) =>
  axios.get(url, { params, withCredentials: true }).then(res => res.data);

export function useTopChartTracks(page = 50, limit = 10) {
  const { data, error, isLoading } = useSWR(
    [
      '/api/track/chart',
      {
        limit: limit,
        page: page,
      },
    ],
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      // revalidateOnReconnect: false,
      // refreshInterval: 0, // Disable periodic polling
    }
  );

  const chartTracks: Track[] =
    data?.tracks.map((track: LastfmRecommendTrack) => ({
      artist: track.artist.name,
      artistUri: track.artist.url,
      title: track.name,
      trackUri: track.url,
      img: track.image[3]['#text'],
      id: track.mbid,
    })) || [];

  return {
    chartTracks,
    isLoading,
    chartTracksError: error ? 'Failed to fetch top chart tracks' : null,
  };
}
