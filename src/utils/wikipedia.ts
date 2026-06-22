export async function fetchWikipediaSummary(year: number): Promise<string> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${year}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'RewindTimeMachine/1.0 (contact: gemini-agent@example.com)'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!res.ok) {
      return `Year ${year} was a notable year in history.`;
    }
    const data = await res.json();
    return data.extract || `Year ${year} was a notable year in history.`;
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error);
    return `Year ${year} was a notable year in history.`;
  }
}
