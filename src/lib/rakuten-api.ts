export interface RakutenItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  affiliateUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  shopName: string;
  reviewAverage: number;
  reviewCount: number;
}

interface RakutenSearchParams {
  keyword: string;
  hits?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface RakutenApiResponse {
  Items: { Item: RakutenItem }[];
}

export async function searchRakutenItems(
  params: RakutenSearchParams
): Promise<RakutenItem[]> {
  const appId = process.env.RAKUTEN_APP_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  if (!appId) throw new Error("RAKUTEN_APP_ID is not set");

  const query = new URLSearchParams({
    applicationId: appId,
    format: "json",
    keyword: params.keyword,
    hits: String(params.hits ?? 6),
    sort: params.sort ?? "-reviewCount",
    ...(affiliateId ? { affiliateId } : {}),
    ...(params.minPrice ? { minPrice: String(params.minPrice) } : {}),
    ...(params.maxPrice ? { maxPrice: String(params.maxPrice) } : {}),
  });

  const res = await fetch(
    `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?${query}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Rakuten API error: ${res.status}`);
  }

  const data: RakutenApiResponse = await res.json();
  return data.Items?.map((i) => i.Item) ?? [];
}
