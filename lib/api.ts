const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Artist = {
  id: number;
  name: string;
  legal_name?: string | null;
  stage_name?: string | null;
  hometown?: string | null;
  roles?: string | null;
  instruments?: string | null;
  image_url?: string | null;
  bio?: string | null;
  bands?: string | null;
};

export type Band = {
  id: number;
  name: string;
  origin_city?: string | null;
  region?: string | null;
  genre?: string | null;
  years_active?: string | null;
  image_url?: string | null;
  bio?: string | null;
  members?: string | null;
  albums?: string | null;
};

export type Album = {
  id: number;
  title: string;
  album_name?: string | null;
  album_title?: string | null;
  artist_name?: string | null;
  band_name?: string | null;
  release_date?: string | null;
  year?: string | null;
  genre?: string | null;
  image_url?: string | null;
  label?: string | null;
  studio?: string | null;
  notes?: string | null;
  sources?: string | null;
  track_list?: string | null;
};

export type CreateArtistPayload = {
  name: string;
  roles?: string;
  city?: string;
  bio?: string;
  image_url?: string;
};

export type UpdateArtistPayload = CreateArtistPayload & {
  bands?: string;
};

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is missing.");
  }

  return API_BASE_URL;
}

export async function getArtists(): Promise<Artist[]> {
  const response = await fetch(`${getApiBaseUrl()}/artists`);

  if (!response.ok) {
    throw new Error(`Failed to fetch artists: ${response.status}`);
  }

  return response.json();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiBaseUrl()}/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.status}`);
  }

  const data = await response.json();

  return data.image_url;
}

export async function createArtist(payload: CreateArtistPayload): Promise<Artist> {
  const response = await fetch(`${getApiBaseUrl()}/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create artist: ${response.status}`);
  }

  return response.json();
}

export async function updateArtist(
  artistId: number,
  payload: UpdateArtistPayload
): Promise<Artist> {
  const response = await fetch(`${getApiBaseUrl()}/artists/${artistId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update artist: ${response.status}`);
  }

  return response.json();
}

export async function deleteArtist(artistId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/artists/${artistId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete artist: ${response.status}`);
  }
}

export async function getBands(): Promise<Band[]> {
  const response = await fetch(`${getApiBaseUrl()}/bands`);

  if (!response.ok) {
    throw new Error(`Failed to fetch bands: ${response.status}`);
  }

  return response.json();
}

export type CreateAlbumPayload = {
  title: string;
  album_name?: string;
  album_title?: string;
  band_name?: string;
  release_date?: string;
  year?: string;
  genre?: string;
  image_url?: string;
  label?: string;
  studio?: string;
  notes?: string;
  sources?: string;
  track_list?: string;
};

export type UpdateAlbumPayload = Partial<CreateAlbumPayload>;

export async function getAlbums(): Promise<Album[]> {
  const response = await fetch(`${getApiBaseUrl()}/albums`);

  if (!response.ok) {
    throw new Error(`Failed to fetch albums: ${response.status}`);
  }

  return response.json();
}

export async function createAlbum(
  payload: CreateAlbumPayload
): Promise<Album> {
  const response = await fetch(`${getApiBaseUrl()}/albums`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create album: ${response.status}`);
  }

  return response.json();
}

export async function updateAlbum(
  albumId: number,
  payload: UpdateAlbumPayload
): Promise<Album> {
  const response = await fetch(`${getApiBaseUrl()}/albums/${albumId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update album: ${response.status}`);
  }

  return response.json();
}

export async function deleteAlbum(albumId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/albums/${albumId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete album: ${response.status}`);
  }
}

export type CreateBandPayload = {
  name: string;
  origin_city?: string;
  region?: string;
  genre?: string;
  years_active?: string;
  bio?: string;
  image_url?: string;
};

export type UpdateBandPayload = Partial<CreateBandPayload>;

export async function createBand(payload: CreateBandPayload): Promise<Band> {
  const response = await fetch(`${getApiBaseUrl()}/bands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create band: ${response.status}`);
  }

  return response.json();
}

export async function updateBand(
  bandId: number,
  payload: UpdateBandPayload
): Promise<Band> {
  const response = await fetch(`${getApiBaseUrl()}/bands/${bandId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update band: ${response.status}`);
  }

  return response.json();
}

export async function deleteBand(bandId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/bands/${bandId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete band: ${response.status}`);
  }
}

export type Flyer = {
  id: number;
  title: string;
  event_name?: string | null;
  venue_name?: string | null;
  band_name?: string | null;
  artist_name?: string | null;
  event_date?: string | null;
  year?: string | null;
  city?: string | null;
  image_url?: string | null;
  notes?: string | null;
  sources?: string | null;
};

export type Venue = {
  id: number;
  name: string;
  city?: string | null;
  region?: string | null;
  address?: string | null;
  years_active?: string | null;
  image_url?: string | null;
  notes?: string | null;
  history?: string | null;
};

export type CreateFlyerPayload = {
  title: string;
  event_name?: string;
  venue_name?: string;
  band_name?: string;
  artist_name?: string;
  event_date?: string;
  year?: string;
  city?: string;
  image_url?: string;
  notes?: string;
  sources?: string;
};

export type UpdateFlyerPayload = Partial<CreateFlyerPayload>;

export async function getFlyers(): Promise<Flyer[]> {
  const response = await fetch(`${getApiBaseUrl()}/flyers`);

  if (!response.ok) {
    throw new Error(`Failed to fetch flyers: ${response.status}`);
  }

  return response.json();
}

export async function createFlyer(payload: CreateFlyerPayload): Promise<Flyer> {
  const response = await fetch(`${getApiBaseUrl()}/flyers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create flyer: ${response.status}`);
  }

  return response.json();
}

export async function updateFlyer(
  flyerId: number,
  payload: UpdateFlyerPayload
): Promise<Flyer> {
  const response = await fetch(`${getApiBaseUrl()}/flyers/${flyerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update flyer: ${response.status}`);
  }

  return response.json();
}

export async function deleteFlyer(flyerId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/flyers/${flyerId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete flyer: ${response.status}`);
  }
}

export type CreateVenuePayload = {
  name: string;
  city?: string;
  region?: string;
  address?: string;
  years_active?: string;
  image_url?: string;
  notes?: string;
  history?: string;
};

export type UpdateVenuePayload = Partial<CreateVenuePayload>;

export async function getVenues(): Promise<Venue[]> {
  const response = await fetch(`${getApiBaseUrl()}/venues`);

  if (!response.ok) {
    throw new Error(`Failed to fetch venues: ${response.status}`);
  }

  return response.json();
}

export async function createVenue(payload: CreateVenuePayload): Promise<Venue> {
  const response = await fetch(`${getApiBaseUrl()}/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create venue: ${response.status}`);
  }

  return response.json();
}

export async function updateVenue(
  venueId: number,
  payload: UpdateVenuePayload
): Promise<Venue> {
  const response = await fetch(`${getApiBaseUrl()}/venues/${venueId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update venue: ${response.status}`);
  }

  return response.json();
}

export async function deleteVenue(venueId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/venues/${venueId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete venue: ${response.status}`);
  }
}

export type Label = {
  id: number;
  name: string;
  city?: string | null;
  region?: string | null;
  years_active?: string | null;
  image_url?: string | null;
  history?: string | null;
  notes?: string | null;
};

export type Studio = {
  id: number;
  name: string;
  city?: string | null;
  region?: string | null;
  address?: string | null;
  years_active?: string | null;
  image_url?: string | null;
  history?: string | null;
  notes?: string | null;
};

export type Video = {
  id: number;
  title: string;
  artist_name?: string | null;
  band_name?: string | null;
  venue_name?: string | null;
  release_date?: string | null;
  year?: string | null;
  url?: string | null;
  image_url?: string | null;
  notes?: string | null;
};

export type BookZine = {
  id: number;
  title: string;
  creator?: string | null;
  publisher?: string | null;
  year?: string | null;
  city?: string | null;
  subject_artist?: string | null;
  subject_band?: string | null;
  image_url?: string | null;
  notes?: string | null;
};

export type Event = {
  id: number;
  title: string;
  event_date?: string | null;
  year?: string | null;
  venue_name?: string | null;
  city?: string | null;
  band_name?: string | null;
  image_url?: string | null;
  notes?: string | null;
};

export type CreateLabelPayload = {
  name: string;
  city?: string;
  region?: string;
  years_active?: string;
  image_url?: string;
  history?: string;
  notes?: string;
};

export type UpdateLabelPayload = Partial<CreateLabelPayload>;

export async function getLabels(): Promise<Label[]> {
  const response = await fetch(`${getApiBaseUrl()}/labels`);

  if (!response.ok) {
    throw new Error(`Failed to fetch labels: ${response.status}`);
  }

  return response.json();
}

export async function createLabel(payload: CreateLabelPayload): Promise<Label> {
  const response = await fetch(`${getApiBaseUrl()}/labels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create label: ${response.status}`);
  }

  return response.json();
}

export async function updateLabel(
  labelId: number,
  payload: UpdateLabelPayload
): Promise<Label> {
  const response = await fetch(`${getApiBaseUrl()}/labels/${labelId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update label: ${response.status}`);
  }

  return response.json();
}

export async function deleteLabel(labelId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/labels/${labelId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete label: ${response.status}`);
  }
}

export type CreateStudioPayload = {
  name: string;
  city?: string;
  region?: string;
  address?: string;
  years_active?: string;
  image_url?: string;
  history?: string;
  notes?: string;
};

export type UpdateStudioPayload = Partial<CreateStudioPayload>;

export async function getStudios(): Promise<Studio[]> {
  const response = await fetch(`${getApiBaseUrl()}/studios`);

  if (!response.ok) {
    throw new Error(`Failed to fetch studios: ${response.status}`);
  }

  return response.json();
}

export async function createStudio(payload: CreateStudioPayload): Promise<Studio> {
  const response = await fetch(`${getApiBaseUrl()}/studios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create studio: ${response.status}`);
  }

  return response.json();
}

export async function updateStudio(
  studioId: number,
  payload: UpdateStudioPayload
): Promise<Studio> {
  const response = await fetch(`${getApiBaseUrl()}/studios/${studioId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update studio: ${response.status}`);
  }

  return response.json();
}

export async function deleteStudio(studioId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/studios/${studioId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete studio: ${response.status}`);
  }
}

export type CreateVideoPayload = {
  title: string;
  artist_name?: string;
  band_name?: string;
  venue_name?: string;
  release_date?: string;
  year?: string;
  url?: string;
  image_url?: string;
  notes?: string;
};

export type UpdateVideoPayload = Partial<CreateVideoPayload>;

export async function getVideos(): Promise<Video[]> {
  const response = await fetch(`${getApiBaseUrl()}/videos`);

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.status}`);
  }

  return response.json();
}

export async function createVideo(payload: CreateVideoPayload): Promise<Video> {
  const response = await fetch(`${getApiBaseUrl()}/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create video: ${response.status}`);
  }

  return response.json();
}

export async function updateVideo(
  videoId: number,
  payload: UpdateVideoPayload
): Promise<Video> {
  const response = await fetch(`${getApiBaseUrl()}/videos/${videoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update video: ${response.status}`);
  }

  return response.json();
}

export async function deleteVideo(videoId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/videos/${videoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete video: ${response.status}`);
  }
}

export type CreateBookZinePayload = {
  title: string;
  creator?: string;
  publisher?: string;
  year?: string;
  city?: string;
  subject_artist?: string;
  subject_band?: string;
  image_url?: string;
  notes?: string;
};

export type UpdateBookZinePayload = Partial<CreateBookZinePayload>;

export async function getBooksZines(): Promise<BookZine[]> {
  const response = await fetch(`${getApiBaseUrl()}/books-zines`);

  if (!response.ok) {
    throw new Error(`Failed to fetch books/zines: ${response.status}`);
  }

  return response.json();
}

export async function createBookZine(payload: CreateBookZinePayload): Promise<BookZine> {
  const response = await fetch(`${getApiBaseUrl()}/books-zines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create book/zine: ${response.status}`);
  }

  return response.json();
}

export async function updateBookZine(
  bookZineId: number,
  payload: UpdateBookZinePayload
): Promise<BookZine> {
  const response = await fetch(`${getApiBaseUrl()}/books-zines/${bookZineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update book/zine: ${response.status}`);
  }

  return response.json();
}

export async function deleteBookZine(bookZineId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/books-zines/${bookZineId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete book/zine: ${response.status}`);
  }
}

export type CreateEventPayload = {
  title: string;
  event_date?: string;
  year?: string;
  venue_name?: string;
  city?: string;
  band_name?: string;
  image_url?: string;
  notes?: string;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${getApiBaseUrl()}/events`);

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  return response.json();
}

export async function createEvent(payload: CreateEventPayload): Promise<Event> {
  const response = await fetch(`${getApiBaseUrl()}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.status}`);
  }

  return response.json();
}

export async function updateEvent(
  eventId: number,
  payload: UpdateEventPayload
): Promise<Event> {
  const response = await fetch(`${getApiBaseUrl()}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update event: ${response.status}`);
  }

  return response.json();
}

export async function deleteEvent(eventId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/events/${eventId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete event: ${response.status}`);
  }
}

