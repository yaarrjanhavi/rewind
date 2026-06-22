import { NextRequest, NextResponse } from 'next/server';
import { fetchWikipediaSummary } from '@/utils/wikipedia';
import { fetchMusicBrainzAlbums } from '@/utils/musicbrainz';
import { generateAIPortrait, generateAIComparison } from '@/utils/gemini';
import { CompareResult } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearAStr = searchParams.get('yearA');
    const yearBStr = searchParams.get('yearB');

    if (!yearAStr || !yearBStr) {
      return NextResponse.json({ error: 'Both yearA and yearB parameters are required' }, { status: 400 });
    }

    const yearA = parseInt(yearAStr, 10);
    const yearB = parseInt(yearBStr, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearA) || yearA < 1900 || yearA > currentYear ||
        isNaN(yearB) || yearB < 1900 || yearB > currentYear) {
      return NextResponse.json(
        { error: `Years must be numbers between 1900 and ${currentYear}` },
        { status: 400 }
      );
    }

    // Fetch summaries and albums for both years in parallel
    const [wikiSummaryA, mbAlbumsA, wikiSummaryB, mbAlbumsB] = await Promise.all([
      fetchWikipediaSummary(yearA),
      fetchMusicBrainzAlbums(yearA),
      fetchWikipediaSummary(yearB),
      fetchMusicBrainzAlbums(yearB)
    ]);

    // Generate snapshot portraits
    const [snapA, snapB] = await Promise.all([
      generateAIPortrait(yearA, wikiSummaryA),
      generateAIPortrait(yearB, wikiSummaryB)
    ]);

    // Merge MusicBrainz for year A
    if (mbAlbumsA && mbAlbumsA.length > 0) {
      const merged = mbAlbumsA.slice(0, 4);
      merged.forEach(album => album.genre = snapA.music.genres[0]?.name || 'Various');
      snapA.music.albums = merged;
    }

    // Merge MusicBrainz for year B
    if (mbAlbumsB && mbAlbumsB.length > 0) {
      const merged = mbAlbumsB.slice(0, 4);
      merged.forEach(album => album.genre = snapB.music.genres[0]?.name || 'Various');
      snapB.music.albums = merged;
    }

    // Generate comparison narrative
    const comparisonNarrative = await generateAIComparison(yearA, yearB, snapA, snapB);

    const compareResult: CompareResult = {
      yearA,
      yearB,
      narrativeA: snapA.narrative,
      narrativeB: snapB.narrative,
      eventsA: snapA.events,
      eventsB: snapB.events,
      musicA: snapA.music,
      musicB: snapB.music,
      capsuleA: snapA.capsule,
      capsuleB: snapB.capsule,
      comparisonNarrative
    };

    return NextResponse.json(compareResult, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('API Error in /api/compare:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}
