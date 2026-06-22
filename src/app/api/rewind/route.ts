import { NextRequest, NextResponse } from 'next/server';
import { fetchWikipediaSummary } from '@/utils/wikipedia';
import { fetchMusicBrainzAlbums } from '@/utils/musicbrainz';
import { generateAIPortrait } from '@/utils/gemini';
import { AlbumItem } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get('year');

    if (!yearStr) {
      return NextResponse.json({ error: 'Year parameter is required' }, { status: 400 });
    }

    const year = parseInt(yearStr, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      return NextResponse.json(
        { error: `Year must be a number between 1900 and ${currentYear}` },
        { status: 400 }
      );
    }

    // Run fetches concurrently
    const [wikiSummary, mbAlbums] = await Promise.all([
      fetchWikipediaSummary(year),
      fetchMusicBrainzAlbums(year)
    ]);

    // Generate the complete cultural snapshot (via Gemini or local procedural fallback)
    const snapshot = await generateAIPortrait(year, wikiSummary);

    // Merge real MusicBrainz albums with generated ones if available to ensure factual accuracy
    if (mbAlbums && mbAlbums.length > 0) {
      const mergedAlbums: AlbumItem[] = [];
      const seenTitles = new Set<string>();

      // Keep up to 4 real albums first
      for (const mbAlbum of mbAlbums) {
        const key = mbAlbum.title.toLowerCase().trim();
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          // Set genre from the first generated genre as a fallback
          mbAlbum.genre = snapshot.music.genres[0]?.name || 'Rock';
          mergedAlbums.push(mbAlbum);
        }
        if (mergedAlbums.length >= 4) break;
      }

      // Fill in with AI albums if we have fewer than 4
      if (mergedAlbums.length < 4) {
        for (const aiAlbum of snapshot.music.albums) {
          const key = aiAlbum.title.toLowerCase().trim();
          if (!seenTitles.has(key)) {
            seenTitles.add(key);
            mergedAlbums.push(aiAlbum);
          }
          if (mergedAlbums.length >= 4) break;
        }
      }

      snapshot.music.albums = mergedAlbums;
    }

    // Set Cache-Control headers to cache results for 1 hour to optimize performance
    return NextResponse.json(snapshot, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('API Error in /api/rewind:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
