export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://strapi.test';

export interface StrapiItem {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  category: string;
  publishedAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface StrapiStatus {
  connected: boolean;
  message: string;
  version?: string;
  latencyMs?: number;
}

/**
 * Check if the Strapi backend is reachable
 */
export async function checkStrapiHealth(): Promise<StrapiStatus> {
  const startTime = Date.now();
  try {
    const res = await fetch(`${STRAPI_URL}/api`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    const latencyMs = Date.now() - startTime;
    // Strapi returns 404 with JSON payload for /api, which means the backend server is active!
    if (res.status === 404 || res.ok) {
      return {
        connected: true,
        message: 'Strapi Backend Online',
        version: '5.52.0',
        latencyMs,
      };
    }
    return {
      connected: false,
      message: `Unexpected status ${res.status}`,
      latencyMs,
    };
  } catch (err) {
    return {
      connected: false,
      message: 'Strapi Server Offline',
    };
  }
}

/**
 * Fetch dynamic content from a Strapi endpoint or return fallback mock data
 */
export async function fetchStrapiCollection(endpoint: string = 'articles'): Promise<{ data: StrapiItem[]; isFallback: boolean }> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}?populate=*`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const formattedData: StrapiItem[] = json.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.attributes?.title || item.title || 'Untitled',
          description: item.attributes?.description || item.description || 'No description provided.',
          category: item.attributes?.category || item.category || 'General',
          publishedAt: item.attributes?.publishedAt || item.publishedAt,
          imageUrl: item.attributes?.cover?.url ? `${STRAPI_URL}${item.attributes.cover.url}` : undefined,
        }));
        return { data: formattedData, isFallback: false };
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch from Strapi endpoint /api/${endpoint}, using demonstration content.`, err);
  }

  // Fallback demonstration content when Strapi collections are empty or not yet created
  return {
    isFallback: true,
    data: [
      {
        id: 1,
        title: 'Building Modern Web Applications with Strapi v5',
        description: 'Explore the powerful headless CMS features of Strapi v5 paired with Next.js App Router for ultra-fast performance.',
        category: 'Development',
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        title: 'PostgreSQL Database Integration & Architecture',
        description: 'How Strapi connects with PostgreSQL to deliver enterprise-grade relational database management and high concurrency.',
        category: 'Database',
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        title: 'Designing API-First Digital Experiences',
        description: 'Learn how to structure content models, dynamic zones, and REST/GraphQL APIs for multi-channel publishing.',
        category: 'Architecture',
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      },
    ],
  };
}
