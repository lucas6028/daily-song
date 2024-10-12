import useSWR from 'swr';
import axios from 'axios';
import type { Artist, SpotifyArtistResponse } from 'types/types';

export function useTopArtist(limit = 1, offset = 0) {
  const { data, error } = useSWR(
    '/api/artist/my-top',
    (url: string) =>
      axios
        .get(url, {
          params: {
            limit: limit,
            offset: offset,
          },
          withCredentials: true,
        })
        .then(res => res.data.body.items),
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      // revalidateOnReconnect: false,
      // refreshInterval: 0, // Disable periodic polling
    }
  );

  const artists: Artist[] =
    data?.map((art: SpotifyArtistResponse) => ({
      name: art.name,
      id: art.id,
      popularity: art.popularity,
      uri: art.uri,
      imgUrl: art.images[1].url,
    })) || [];

  return {
    artists,
    artistsError: error ? 'Failed to fetch top artists' : null,
  };
}
