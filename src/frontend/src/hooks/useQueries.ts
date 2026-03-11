import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tier: string;
  iconName: string;
}

export function useAllTools() {
  return useQuery<Tool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tools`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useToolBySlug(slug: string) {
  return useQuery<Tool | null>({
    queryKey: ["tool", slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const res = await fetch(`${API_URL}/tools/${slug}`);
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error('Network response was not ok');
        }
        return res.json();
      } catch {
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useToolsByCategory(category: string) {
  return useQuery<Tool[]>({
    queryKey: ["tools", "category", category],
    queryFn: async () => {
      if (!category) return [];
      const res = await fetch(`${API_URL}/tools/category/${category}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}
