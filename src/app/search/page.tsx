import SearchResults from "@/components/sections/SerachResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams:any;
}) {
  const plainParams = Object.fromEntries(Object.entries(searchParams));
  const params:any = new URLSearchParams(plainParams as any);
  const queryString = params.toString();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = new URL(`/api/search?${queryString}`, baseUrl);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error fetching search results");
  }
  const properties = await response.json();

  return <SearchResults properties={properties} />;
}
