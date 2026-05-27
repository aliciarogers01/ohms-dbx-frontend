import { Artist, Band } from "@/lib/api";

export function parseRelationshipList<T>(value?: string | null): T[] {
  if (!value || value === "{}") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isBadRelationshipName(name?: string | null) {
  if (!name) {
    return true;
  }

  const trimmedName = name.trim();

  return (
    trimmedName.startsWith("[") ||
    trimmedName.startsWith("{") ||
    trimmedName.includes('"id"') ||
    trimmedName.includes('"name"')
  );
}

export function addBandToArtistBands(artist: Artist, band: Band) {
  const artistBands = parseRelationshipList<Band>(artist.bands);

  const cleanBand = {
    id: band.id,
    name: band.name,
    origin_city: band.origin_city ?? "",
    genre: band.genre ?? "",
    image_url: band.image_url ?? "",
  };

  const updatedArtistBands = artistBands.some((item) => item.id === band.id)
    ? artistBands
    : [...artistBands, cleanBand];

  return JSON.stringify(updatedArtistBands);
}