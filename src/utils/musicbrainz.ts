import { AlbumItem } from '../types';

export async function fetchMusicBrainzAlbums(year: number): Promise<AlbumItem[]> {
  try {
    // MusicBrainz search release query for date:year, filtered by release type "album" and status "official"
    const query = encodeURIComponent(`date:${year} AND type:album AND status:official`);
    const url = `https://musicbrainz.org/ws/2/release?query=${query}&limit=8&fmt=json`;
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'RewindTimeMachine/1.0.0 ( gemini-agent@example.com )'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const releases = data.releases || [];

    const albums: AlbumItem[] = [];

    for (const release of releases) {
      const id = release.id;
      const title = release.title;
      const artist = release['artist-credit']?.[0]?.name || 'Unknown Artist';
      const releaseDate = release.date;
      
      // Try to construct a cover URL from the Cover Art Archive (standard format)
      // We don't fetch Cover Art Archive synchronously for all releases because it can cause API blocks,
      // but the front cover image endpoint redirect is predictable: https://coverartarchive.org/release/${id}/front-250
      const coverUrl = `https://coverartarchive.org/release/${id}/front-250`;

      albums.push({
        title,
        artist,
        releaseDate,
        coverUrl, // We will verify this on the client side or use a fallback if it fails to load
        genre: 'Various'
      });
    }

    return albums;
  } catch (error) {
    console.error('Error fetching MusicBrainz albums:', error);
    return [];
  }
}
