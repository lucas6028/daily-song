export interface DashboardProps {
  code: string;
}

export interface RequestAccessProps {
  urlCode: string | null;
  onTokenReceived: (expiresIn: number) => void;
}

// Define the structure of the track's artist
interface Artist {
  name: string;
  uri: string;
}

// Define the structure of the album's image
interface Image {
  url: string;
}

// Define the structure of the album
interface Album {
  images: Image[];
  uri: string;
  name: string;
}

// Define the structure of the track item
interface TrackItem {
  artists: Artist[];
  name: string;
  id: string;
  uri: string;
  album: Album;
}

// Define the structure of the API response data
export interface SpotifyItemsResponse {
  body: {
    items: TrackItem[];
  };
}

export interface SpotifyTracksResponse {
  body: {
    tracks: TrackItem[];
  };
}

// Define the Track type that you'll use in the component state
export interface Track {
  albumName: string;
  albumUri: string;
  artist: string;
  artistUri: string;
  title: string;
  id: string;
  trackUri: string;
  img: string;
}

export interface SwipeableSliderProps {
  items: {
    albumName: string;
    albumUri: string;
    img: string;
    artist: string;
    artistUri: string;
    title: string;
    id: string;
    trackUri: string;
  }[];
  onCardClick?: (newUri: string) => void;
}

export interface SwipeableCardProps {
  item: {
    albumName: string;
    albumUri: string;
    img: string;
    artist: string;
    artistUri: string;
    title: string;
    id: string;
    trackUri: string;
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onClick?: (newUri: string) => void;
  isActive: boolean;
  isSwiping: boolean;
  swipeDirection: 'left' | 'right';
}

interface ArtistImg {
  images: Image[];
}
export interface Artist {
  name: string;
  id: string;
  popularity: number;
  uri: string;
  imgUrl: string;
}

interface SpotifyArtistResponse {
  name: string;
  id: string;
  popularity: number;
  uri: string;
  images: Image[];
}

export interface LastfmArtist {
  name: string;
  mbid: string;
  url: string;
  image: Image[];
}

export interface LastfmImage {
  '#text': string;
  size: string;
}

export interface LastfmRecommendTrack {
  artist: LastfmArtist;
  duraction: number;
  image: LastfmImage[];
  match: number;
  mbid: string;
  name: string;
  playcount: number;
  url: string;
}

export interface KKBOXTrack {
  id: string;
  name: string;
  duration: number;
  url: string;
  track_number: number;
  explicitness: boolean;
  album: KKBOXAlbum;
}

interface KKBOXAlbum {
  id: string;
  name: string;
  url: string;
  explicitness: boolean;
  replease_date: string;
  images: KKBOXImage[];
  artist: KKBOXArtist;
}

interface KKBOXImag {
  height: number;
  width: number;
  url: string;
}

interface KKBOXArtist {
  id: string;
  name: string;
  url: string;
  images: KKBOXImage[];
}
