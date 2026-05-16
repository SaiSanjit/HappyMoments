export interface GeoState {
  name: string;
  cities: string[];
}

export interface IndiaGeo {
  states: GeoState[];
  cityStateMap: Record<string, string>;
}

let cache: IndiaGeo | null = null;

export async function fetchIndiaGeo(): Promise<IndiaGeo> {
  if (cache) return cache;

  const res = await fetch(
    "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries+states+cities.json",
    { next: { revalidate: 86400 } } // cache for 24h in Next.js
  );

  if (!res.ok) throw new Error("Failed to load location data.");

  const all = await res.json();
  const india = all.find((c: { iso2: string }) => c.iso2 === "IN");

  const states: GeoState[] = india.states
    .map((s: { name: string; cities: { name: string }[] }) => ({
      name: s.name,
      cities: s.cities.map((c) => c.name).sort(),
    }))
    .filter((s: GeoState) => s.cities.length > 0)
    .sort((a: GeoState, b: GeoState) => a.name.localeCompare(b.name));

  const cityStateMap: Record<string, string> = {};
  for (const s of states) {
    for (const city of s.cities) {
      cityStateMap[city] = s.name;
    }
  }

  cache = { states, cityStateMap };
  return cache;
}
