import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface CompetitorInfo {
  name: string;
  pricing: string;
  features: string[];
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  // Uses a pay-per-use search API via Locus
  const response = await axios.get('https://api.paywithlocus.com/api/search', {
    params: { q: query },
    headers: {
      'Authorization': `Bearer ${process.env.LOCUS_API_KEY || ''}`,
    },
  });
  return response.data.results;
}

export async function analyzeCompetitor(url: string): Promise<CompetitorInfo> {
  const response = await axios.get('https://api.paywithlocus.com/api/analyze', {
    params: { url },
    headers: {
      'Authorization': `Bearer ${process.env.LOCUS_API_KEY || ''}`,
    },
  });
  return {
    name: response.data.name,
    pricing: response.data.pricing,
    features: response.data.features,
  };
}
