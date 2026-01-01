import { useQuery } from "@tanstack/react-query";
import type { Drama, SearchResult } from "@/types/drama";

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/drama-proxy`;

async function fetchDramas(endpoint: string): Promise<Drama[]> {
  const response = await fetch(`${PROXY_URL}?endpoint=${endpoint}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dramas");
  }
  return response.json();
}

async function searchDramas(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(`${PROXY_URL}?endpoint=search&query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Failed to search dramas");
  }
  return response.json();
}

export function useForYouDramas() {
  return useQuery({
    queryKey: ["dramas", "foryou"],
    queryFn: () => fetchDramas("foryou"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLatestDramas() {
  return useQuery({
    queryKey: ["dramas", "latest"],
    queryFn: () => fetchDramas("latest"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingDramas() {
  return useQuery({
    queryKey: ["dramas", "trending"],
    queryFn: () => fetchDramas("trending"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchDramas(query: string) {
  return useQuery({
    queryKey: ["dramas", "search", query],
    queryFn: () => searchDramas(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2,
  });
}
