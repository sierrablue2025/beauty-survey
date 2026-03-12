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
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beauty-survey.vercel.app";

  if (!appId) throw new Error("RAKUTEN_APP_ID is not set");
  if (!accessKey) throw new Error("RAKUTEN_ACCESS_KEY is not set");

  const query = new URLSearchParams({
    applicationId: appId,
    accessKey: accessKey,
    format: "json",
    keyword: params.keyword,
    hits: String(params.hits ?? 6),
    sort: params.sort ?? "-reviewCount",
    ...(affiliateId ? { affiliateId } : {}),
    ...(params.minPrice ? { minPrice: String(params.minPrice) } : {}),
    ...(params.maxPrice ? { maxPrice: String(params.maxPrice) } : {}),
  });

  const res = await fetch(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?${query}`,
    {
      headers: {
        Origin: siteUrl,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Rakuten API error: ${res.status} ${err}`);
  }

  const data: RakutenApiResponse = await res.json();
  return data.Items?.map((i) => i.Item) ?? [];
}
