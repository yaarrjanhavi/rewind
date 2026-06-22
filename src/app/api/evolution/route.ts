import { NextRequest, NextResponse } from 'next/server';

export interface GenreTrendPoint {
  year: number;
  Rock: number;
  Jazz: number;
  Pop: number;
  'Hip-Hop': number;
  Disco: number;
  Electronic: number;
  annotation?: string;
}

const evolutionData: GenreTrendPoint[] = [
  { year: 1900, Rock: 0, Jazz: 15, Pop: 10, 'Hip-Hop': 0, Disco: 0, Electronic: 0, annotation: "Ragtime & Brass Bands rule" },
  { year: 1910, Rock: 0, Jazz: 25, Pop: 15, 'Hip-Hop': 0, Disco: 0, Electronic: 0, annotation: "Early blues recordings" },
  { year: 1920, Rock: 0, Jazz: 75, Pop: 30, 'Hip-Hop': 0, Disco: 0, Electronic: 0, annotation: "The Roaring Twenties Jazz Age" },
  { year: 1930, Rock: 0, Jazz: 90, Pop: 40, 'Hip-Hop': 0, Disco: 0, Electronic: 0, annotation: "Swing Era and Big Bands" },
  { year: 1940, Rock: 5, Jazz: 60, Pop: 55, 'Hip-Hop': 0, Disco: 0, Electronic: 0, annotation: "Traditional pop crooners arise" },
  { year: 1950, Rock: 45, Jazz: 35, Pop: 60, 'Hip-Hop': 0, Disco: 0, Electronic: 2, annotation: "Rock & Roll explodes" },
  { year: 1960, Rock: 95, Jazz: 20, Pop: 70, 'Hip-Hop': 0, Disco: 0, Electronic: 10, annotation: "Beatlemania & Psychedelic Rock" },
  { year: 1970, Rock: 85, Jazz: 15, Pop: 75, 'Hip-Hop': 5, Disco: 85, Electronic: 25, annotation: "Disco Fever & Progressive Rock" },
  { year: 1980, Rock: 70, Jazz: 8, Pop: 95, 'Hip-Hop': 35, Disco: 10, Electronic: 65, annotation: "Synth-Pop & MTV Age begins" },
  { year: 1990, Rock: 80, Jazz: 5, Pop: 85, 'Hip-Hop': 75, Disco: 5, Electronic: 70, annotation: "Grunge rebellion & Rap Golden Era" },
  { year: 2000, Rock: 55, Jazz: 5, Pop: 90, 'Hip-Hop': 90, Disco: 5, Electronic: 75, annotation: "Y2K Teen Pop & MP3 sharing" },
  { year: 2010, Rock: 35, Jazz: 5, Pop: 92, 'Hip-Hop': 95, Disco: 15, Electronic: 85, annotation: "EDM boom & Streaming playlists" },
  { year: 2020, Rock: 30, Jazz: 8, Pop: 95, 'Hip-Hop': 96, Disco: 20, Electronic: 90, annotation: "TikTok viral sounds & Trap dominance" }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(evolutionData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
